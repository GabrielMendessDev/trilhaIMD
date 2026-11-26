import "server-only";
import type { LessonCursor } from "~/app/aprender/_etapa/lesson-view";
import {
	lifeItems,
	livesOf,
	MAX_LIVES,
	restoredLives,
} from "~/domain/lesson-lives.mjs";
import { economy, items } from "~/domain/rpg";
import { db } from "./db";
import elementarChecks from "./elementar-material-checks.json";
import { getLesson } from "./lesson-catalog";
import { lessonItems } from "./lesson-content";
import { type LessonProgress, pendingItem } from "./lesson-progress";
import {
	accessiblePoint,
	itemCompatibility,
	lessonCursor,
	publicEffects,
} from "./lesson-resources";
import { persistLesson } from "./lesson-state";
import {
	emitRpg,
	ensureRpg,
	lockWallet,
	RpgError,
	readRpgBalance,
	readRpgInventory,
	readRpgState,
	registerStudy,
} from "./rpg";
import {
	contextualExample,
	effectiveEntry,
	getQuestionState,
	replacementFor,
	supportFor,
} from "./rpg-support";

export {
	getAllQuestionStates,
	itemCompatibility,
	lessonBag,
	lessonCursor,
} from "./lesson-resources";

export async function applyQuestionItem(
	userId: string,
	itemId: string,
	requestId: string,
	pointId: number,
	entryKey: string,
	round: 1 | 2,
	confirmed: boolean,
	lessonRun = 1,
	withFlow = false,
) {
	await ensureRpg(userId);
	const item = items.find((i) => i.id === itemId);
	if (item?.kind !== "consumable" || itemId === "streak-shield")
		throw new RpgError("Item indisponível nesta questão.");
	const lesson = await getLesson(pointId);
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
			let completedAt: Date | null = null;
			let awards: string[] = [];
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
				completedAt = saved.completedAt;
				awards = saved.awards;
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
				cursor: withFlow
					? await lessonCursor({
							userId,
							point,
							lesson,
							progress: state,
							completedAt,
							awards,
							connection: tx,
							knownEffects: destination ? undefined : { [entryKey]: effects },
						})
					: undefined,
			};
			await tx.$executeRaw`INSERT INTO "ItemUsage"("userId","requestId","itemId","pointId","entryKey",action,result) VALUES (${userId},${requestId},${itemId},${pointId},${entryKey},'use',${JSON.stringify(applied)}::jsonb)`;
			return applied;
		},
		{ timeout: 15000 },
	);
	if (withFlow) {
		const [rpg, inventory] = await Promise.all([
			readRpgBalance(userId),
			readRpgInventory(userId),
		]);
		return {
			result,
			rpg,
			inventory: Object.fromEntries(
				inventory.map(({ itemId, quantity }) => [itemId, quantity]),
			),
		};
	}
	return { result, state: await readRpgState(userId) };
}

export async function restartLesson(
	userId: string,
	pointId: number,
	requestId: string,
	lessonRun: number,
	withFlow = false,
) {
	await ensureRpg(userId);
	const lesson = withFlow ? await getLesson(pointId) : [];
	return db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const [prior] = await tx.$queryRaw<
			{
				pointId: number;
				action: string;
				result: {
					run: number;
					lives: number;
					destination: string;
					cursor?: LessonCursor;
				};
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
			cursor: withFlow
				? await lessonCursor({
						userId,
						point,
						lesson,
						progress: {
							completedEntries: [],
							attempts: {},
							lives: MAX_LIVES,
							run: row.run + 1,
						},
						knownEffects: {},
						connection: tx,
					})
				: undefined,
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
	const lesson = await getLesson(pointId);
	const result = await db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const awards: string[] = [];
		const point = await accessiblePoint(tx, userId, pointId);
		const entry = lesson.find((e) => e.key === entryKey);
		if (
			!entry ||
			(entry.content as { categoria?: string } | null)?.categoria !== "material"
		)
			throw new RpgError("Material complementar indisponível.");
		const challenge =
			point.trail === "elementar"
				? elementarChecks[point.number - 1]
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
