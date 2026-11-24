import fmcChecks from "./fmc-material-checks.json";
import "server-only";
import {
	lifeItems,
	livesOf,
	MAX_LIVES,
	restoredLives,
} from "~/domain/lesson-lives.mjs";
import { isEssentialQuestion } from "~/domain/question-policy";
import { economy, items } from "~/domain/rpg";
import { db } from "./db";
import elementarChecks from "./elementar-material-checks.json";
import {
	type Entry,
	getLesson,
	isGraded,
	lessonItems,
	toStageModel,
} from "./lesson";
import { type LessonProgress, pendingItem } from "./lesson-progress";
import { persistLesson } from "./lesson-state";
import {
	emitRpg,
	ensureRpg,
	getRpgState,
	lockWallet,
	RpgError,
	type RpgTx,
	readRpgState,
	registerStudy,
} from "./rpg";
import {
	contextualExample,
	effectiveEntry,
	getQuestionState,
	type QuestionEffects,
	type QuestionState,
	replacementFor,
	supportFor,
} from "./rpg-support";

export async function getAllQuestionStates(userId: string, pointId: number) {
	const rows = await db.$queryRaw<
		(QuestionState & { entryKey: string })[]
	>`SELECT "entryKey",effects,assisted FROM "RpgQuestionState" WHERE "userId"=${userId} AND "pointId"=${pointId}`;
	return Object.fromEntries(rows.map((row) => [row.entryKey, row]));
}
async function accessiblePoint(tx: RpgTx, userId: string, pointId: number) {
	const [point] = await tx.$queryRaw<
		{ id: number; trail: string; number: number; reward: number }[]
	>`SELECT p.id,p."trailSlug" AS trail,p.number,p."xpReward" AS reward FROM "TrailPoint" p JOIN "LearningTrail" t ON t.slug=p."trailSlug" WHERE p.id=${pointId} AND NOT t.archived`;
	if (!point) throw new RpgError("Lição indisponível.");
	const [earlier] = await tx.$queryRaw<
		{ count: number }[]
	>`SELECT count(*)::int AS count FROM "TrailPoint" p WHERE p."trailSlug"=${point.trail} AND p.number<${point.number} AND (EXISTS(SELECT 1 FROM "LearningActivity" a WHERE a."pointId"=p.id) OR EXISTS(SELECT 1 FROM "TrailPointContent" c WHERE c."pointId"=p.id)) AND NOT EXISTS(SELECT 1 FROM "LearningPointProgress" l WHERE l."userId"=${userId} AND l."pointId"=p.id AND l."completedAt" IS NOT NULL)`;
	if (earlier?.count)
		throw new RpgError("Conclua a etapa disponível no mapa antes desta lição.");
	return point;
}
export function itemCompatibility(
	itemId: string,
	entry: Entry,
	number: number,
	round: 1 | 2,
	state: LessonProgress,
	effects: QuestionEffects,
	lesson: Entry[],
) {
	if (!isGraded(entry)) return "Este recurso é usado nas questões.";
	if (livesOf(state) === 0)
		return "Esta atividade foi perdida. Recomece para continuar.";
	if (
		state.attempts[entry.key]?.[round - 1] ||
		state.skippedEntries?.includes(entry.key)
	)
		return "Esta resposta já foi encerrada.";
	if (lifeItems[itemId]) {
		if (round === 2)
			return "A revisão não perde vidas e não precisa de reposição.";
		return livesOf(state) >= MAX_LIVES
			? "Você já tem as 5 vidas desta atividade."
			: null;
	}
	if (itemId === "hint-scroll") {
		const hint = (entry.payload as { orientacao?: string } | null)?.orientacao;
		return effects.hint
			? "A dica já está aberta."
			: !hint?.trim() || /resposta (correta|certa) (é|:)/i.test(hint)
				? "Ainda não há dica válida para esta questão."
				: null;
	}
	if (itemId === "example-scroll")
		return effects.example
			? "O exemplo já está aberto."
			: !contextualExample(entry, number)
				? "Ainda não há exemplo adicional para esta habilidade."
				: null;
	if (itemId === "answer-lens") {
		const options = (entry.payload as { alternativas?: unknown[] } | null)
			?.alternativas;
		return effects.removed?.length
			? "A lente já foi usada."
			: entry.type !== "MULTIPLE_CHOICE" || !options || options.length <= 2
				? "A lente precisa de múltipla escolha com ao menos três opções."
				: null;
	}
	if (itemId === "question-pass" || itemId === "challenge-swap") {
		if (round !== 1) return "Disponível apenas antes da primeira resposta.";
		if (isEssentialQuestion(entry, number, lesson))
			return "Esta questão essencial precisa ser respondida sem pulo ou troca.";
		if (itemId === "question-pass") {
			const count = lesson.filter(isGraded).length;
			return count - (state.skippedEntries?.length ?? 0) - 1 <
				Math.ceil(count * economy.minimumAnswerRatio)
				? "O mínimo de questões respondidas deve ser preservado."
				: null;
		}
		return effects.replacement ||
			effects.removed?.length ||
			effects.hint ||
			effects.example
			? "A troca deve vir antes dos outros auxílios."
			: !replacementFor(entry, number)
				? "Não há variante equivalente validada para esta questão."
				: null;
	}
	if (itemId === "tactical-delay")
		return round !== 1
			? "Adie apenas na primeira rodada."
			: effects.deferred
				? "Esta questão já foi adiada."
				: !lesson.some(
							(item) =>
								item.key !== entry.key &&
								!state.completedEntries.includes(item.key) &&
								!state.deferredEntries?.includes(item.key),
						)
					? "Não há outra tela para estudar antes desta questão."
					: null;
	return "Ative ou equipe este item na Mochila, fora da questão.";
}
function publicEffects(entry: Entry, effects: QuestionEffects) {
	const effective = effectiveEntry(entry, effects);
	return {
		hint: effects.hint,
		example: effects.example,
		removed: effects.removed ?? [],
		variant: effects.replacement?.key ?? "",
		model: toStageModel(effective),
	};
}
export async function lessonBag(
	userId: string,
	pointId: number,
	entryKey: string,
	round: 1 | 2,
) {
	const point = await accessiblePoint(db, userId, pointId);
	const [lesson, rpg] = await Promise.all([
		getLesson(pointId),
		getRpgState(userId),
	]);
	const entry = lesson.find((e) => e.key === entryKey);
	if (!entry) throw new RpgError("Questão indisponível.");
	const [state] = await db.$queryRaw<
		(LessonProgress & { completedAt: Date | null })[]
	>`SELECT "completedEntries",attempts,"skippedEntries","deferredEntries","completedAt",lives,run FROM "LearningPointProgress" WHERE "userId"=${userId} AND "pointId"=${pointId}`;
	const progress: LessonProgress = state ?? {
		completedEntries: [],
		attempts: {},
	};
	const question = await getQuestionState(userId, pointId, entryKey);
	const pending = pendingItem(lessonItems(lesson), progress);
	return {
		inventory: rpg.inventory.map((item) => ({
			...item,
			reason:
				state?.completedAt ||
				pending?.key !== entryKey ||
				pending.round !== round
					? "Esta questão não está disponível para uso."
					: itemCompatibility(
							item.id,
							effectiveEntry(entry, question.effects),
							point.number,
							round,
							progress,
							question.effects,
							lesson,
						),
		})),
		...publicEffects(entry, question.effects),
		lives: livesOf(progress),
		run: progress.run ?? 1,
	};
}

export async function applyQuestionItem(
	userId: string,
	itemId: string,
	requestId: string,
	pointId: number,
	entryKey: string,
	round: 1 | 2,
	confirmed: boolean,
	lessonRun = 1,
) {
	await ensureRpg(userId);
	const item = items.find((i) => i.id === itemId);
	if (item?.kind !== "consumable" || itemId === "streak-shield")
		throw new RpgError("Item indisponível nesta questão.");
	const result = await db.$transaction(
		async (tx) => {
			await lockWallet(tx, userId);
			const [prior] = await tx.$queryRaw<
				{
					itemId: string;
					pointId: number;
					entryKey: string;
					result: Record<string, unknown>;
				}[]
			>`SELECT "itemId","pointId","entryKey",result FROM "ItemUsage" WHERE "userId"=${userId} AND "requestId"=${requestId}`;
			if (prior) {
				if (
					prior.itemId !== itemId ||
					prior.pointId !== pointId ||
					prior.entryKey !== entryKey
				)
					throw new RpgError(
						"Esta operação já foi usada em outro contexto.",
						409,
					);
				if ((prior.result.run ?? 1) !== lessonRun)
					throw new RpgError(
						"Esta operação pertence a outra execução da atividade.",
						409,
					);
				return prior.result;
			}
			const point = await accessiblePoint(tx, userId, pointId);
			const lesson = await getLesson(pointId);
			const original = lesson.find((e) => e.key === entryKey);
			if (!original) throw new RpgError("Questão indisponível.");
			await tx.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId") VALUES (${userId},${pointId}) ON CONFLICT DO NOTHING`;
			const [state] = await tx.$queryRaw<
				(LessonProgress & { completedAt: Date | null })[]
			>`SELECT "completedEntries",attempts,"skippedEntries","deferredEntries","completedAt",lives,run FROM "LearningPointProgress" WHERE "userId"=${userId} AND "pointId"=${pointId} FOR UPDATE`;
			if (!state || state.completedAt)
				throw new RpgError("Esta lição já foi concluída.");
			if ((state.run ?? 1) !== lessonRun)
				throw new RpgError("A atividade foi recomeçada. Atualize a tela.", 409);
			const pending = pendingItem(lessonItems(lesson), state);
			if (pending?.key !== entryKey || pending.round !== round)
				throw new RpgError("Abra a questão atual antes de usar um item.");
			const previous = await getQuestionState(userId, pointId, entryKey, tx);
			const entry = effectiveEntry(original, previous.effects);
			const effects = { ...previous.effects };
			const reason = itemCompatibility(
				itemId,
				entry,
				point.number,
				round,
				state,
				effects,
				lesson,
			);
			if (reason) throw new RpgError(reason);
			if (lifeItems[itemId]) {
				state.lives = restoredLives(livesOf(state), lifeItems[itemId]);
				await tx.$executeRaw`UPDATE "LearningPointProgress" SET lives=${state.lives} WHERE "userId"=${userId} AND "pointId"=${pointId}`;
			}
			if (itemId === "question-pass" && !confirmed)
				throw new RpgError(
					"Confirme o pulo: esta questão ficará sem pontuação.",
				);
			if (itemId === "hint-scroll")
				effects.hint = (entry.payload as { orientacao: string }).orientacao;
			if (itemId === "example-scroll")
				effects.example = contextualExample(entry, point.number);
			if (itemId === "answer-lens") {
				const alternatives = (
					entry.payload as { alternativas: { id: string }[] }
				).alternativas;
				effects.removed = alternatives
					.filter((a) => a.id !== entry.answer)
					.slice(0, Math.min(2, alternatives.length - 2))
					.map((a) => a.id);
			}
			if (itemId === "challenge-swap")
				effects.replacement = replacementFor(entry, point.number);
			if (itemId === "tactical-delay") {
				effects.deferred = true;
				state.deferredEntries = [...(state.deferredEntries ?? []), entryKey];
			}
			if (itemId === "question-pass") {
				effects.skipped = true;
				state.completedEntries = [...state.completedEntries, entryKey];
				state.skippedEntries = [...(state.skippedEntries ?? []), entryKey];
			}
			const consumed =
				await tx.$executeRaw`UPDATE "InventoryItem" SET quantity=quantity-1 WHERE "userId"=${userId} AND "itemId"=${itemId} AND quantity>0`;
			if (!consumed)
				throw new RpgError(
					"Este item acabou. Visite a Loja do Bito para repor.",
				);
			if (!lifeItems[itemId])
				await tx.$executeRaw`INSERT INTO "RpgQuestionState"("userId","pointId","entryKey",effects,assisted) VALUES (${userId},${pointId},${entryKey},${JSON.stringify(effects)}::jsonb,true) ON CONFLICT ("userId","pointId","entryKey") DO UPDATE SET effects=EXCLUDED.effects,assisted=true`;
			await emitRpg(tx, userId, `item:${requestId}`, { kind: "break" });
			let destination: string | undefined;
			if (itemId === "question-pass" || itemId === "tactical-delay") {
				const saved = await persistLesson(
					tx,
					userId,
					pointId,
					state,
					lessonItems(lesson),
					point.reward,
				);
				const base = `/aprender/${point.trail}/${point.number}`;
				destination = saved.pending
					? `${base}?item=${saved.pending.key}`
					: base;
			}
			const applied = {
				...publicEffects(original, effects),
				destination,
				itemId,
				lives: livesOf(state),
				run: state.run ?? 1,
			};
			await tx.$executeRaw`INSERT INTO "ItemUsage"("userId","requestId","itemId","pointId","entryKey",action,result) VALUES (${userId},${requestId},${itemId},${pointId},${entryKey},'use',${JSON.stringify(applied)}::jsonb)`;
			return applied;
		},
		{ timeout: 15000 },
	);
	return { result, state: await readRpgState(userId) };
}

export async function restartLesson(
	userId: string,
	pointId: number,
	requestId: string,
	lessonRun: number,
) {
	await ensureRpg(userId);
	return db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const [prior] = await tx.$queryRaw<
			{
				pointId: number;
				action: string;
				result: { run: number; lives: number; destination: string };
			}[]
		>`SELECT "pointId",action,result FROM "ItemUsage" WHERE "userId"=${userId} AND "requestId"=${requestId}`;
		if (prior) {
			if (prior.pointId !== pointId || prior.action !== "restart")
				throw new RpgError("Operação já usada em outro contexto.", 409);
			return prior.result;
		}
		const point = await accessiblePoint(tx, userId, pointId);
		const [row] = await tx.$queryRaw<
			{ lives: number; run: number; completedAt: Date | null }[]
		>`SELECT lives,run,"completedAt" FROM "LearningPointProgress" WHERE "userId"=${userId} AND "pointId"=${pointId} FOR UPDATE`;
		if (!row || row.completedAt || row.lives !== 0 || row.run !== lessonRun)
			throw new RpgError(
				"Recomece apenas a execução atual de uma atividade perdida.",
				409,
			);
		await tx.$executeRaw`UPDATE "LearningPointProgress" SET "completedEntries"=ARRAY[]::text[],attempts='{}'::jsonb,"skippedEntries"=ARRAY[]::text[],"deferredEntries"=ARRAY[]::text[],lives=5,run=run+1,xp=0,"correctAnswers"=0 WHERE "userId"=${userId} AND "pointId"=${pointId}`;
		await tx.$executeRaw`DELETE FROM "RpgQuestionState" WHERE "userId"=${userId} AND "pointId"=${pointId}`;
		const result = {
			run: row.run + 1,
			lives: MAX_LIVES,
			destination: `/aprender/${point.trail}/${point.number}`,
		};
		await tx.$executeRaw`INSERT INTO "ItemUsage" ("userId","requestId","itemId","pointId",action,result) VALUES (${userId},${requestId},'lesson-restart',${pointId},'restart',${JSON.stringify(result)}::jsonb)`;
		return result;
	});
}

export async function materialAction(
	userId: string,
	pointId: number,
	entryKey: string,
	answer?: string,
) {
	await ensureRpg(userId);
	const result = await db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const awards: string[] = [];
		const point = await accessiblePoint(tx, userId, pointId);
		const lesson = await getLesson(pointId);
		const entry = lesson.find((e) => e.key === entryKey);
		if (
			!entry ||
			(entry.content as { categoria?: string } | null)?.categoria !== "material"
		)
			throw new RpgError("Material complementar indisponível.");
		const challenge =
			point.trail === "elementar"
				? elementarChecks[point.number - 1]
				: point.trail === "fmc"
					? fmcChecks[point.number - 1]
					: supportFor(point.number);
		if (!challenge)
			throw new RpgError(
				"A verificação deste material ainda não foi cadastrada.",
			);
		await tx.$executeRaw`INSERT INTO "MaterialReading"("userId","pointId","entryKey") VALUES (${userId},${pointId},${entryKey}) ON CONFLICT DO NOTHING`;
		const [reading] = await tx.$queryRaw<
			{ startedAt: Date; completedAt: Date | null }[]
		>`SELECT "startedAt","completedAt" FROM "MaterialReading" WHERE "userId"=${userId} AND "pointId"=${pointId} AND "entryKey"=${entryKey}`;
		if (answer && !reading?.completedAt) {
			if (
				!reading ||
				(Date.now() - reading.startedAt.getTime()) / 1000 <
					economy.materialSeconds
			)
				throw new RpgError("Leia o material antes de concluir a verificação.");
			if (answer !== challenge.answer)
				throw new RpgError("Retome o conceito no material e tente novamente.");
			await tx.$executeRaw`UPDATE "MaterialReading" SET "completedAt"=now() WHERE "userId"=${userId} AND "pointId"=${pointId} AND "entryKey"=${entryKey}`;
			const achievement = await emitRpg(
				tx,
				userId,
				`material:${pointId}:${entryKey}`,
				{
					kind: "material",
				},
			);
			const study = await registerStudy(tx, userId);
			awards.push(...achievement.awards, ...study.awards);
		}
		return {
			awards,
			completed: Boolean(reading?.completedAt || answer),
			remaining: Math.max(
				0,
				economy.materialSeconds -
					Math.floor(
						(Date.now() - (reading?.startedAt.getTime() ?? Date.now())) / 1000,
					),
			),
			prompt: challenge.prompt,
			choices: challenge.alternatives.map((a) => ({
				id: a.id,
				label: a.texto,
			})),
		};
	});
	const state = await readRpgState(userId);
	return {
		...result,
		awards: state.achievements.filter((a) => result.awards.includes(a.id)),
		state,
	};
}
