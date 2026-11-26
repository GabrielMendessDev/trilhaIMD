import "server-only";
import type {
	LessonBagView,
	LessonCursor,
} from "~/app/aprender/_etapa/lesson-view";
import { lifeItems, livesOf, MAX_LIVES } from "~/domain/lesson-lives.mjs";
import { isEssentialQuestion } from "~/domain/question-policy";
import { achievements, economy, items } from "~/domain/rpg";
import { db } from "./db";
import { getLesson } from "./lesson-catalog";
import {
	type Entry,
	isGraded,
	lessonItems,
	toStageModel,
} from "./lesson-content";
import {
	type LessonProgress,
	lessonProgressPercent,
	lessonScore,
	pendingItem,
} from "./lesson-progress";
import { getCompletionBits, getRpgSummary, RpgError, type RpgTx } from "./rpg";
import {
	contextualExample,
	effectiveEntry,
	getQuestionState,
	type QuestionEffects,
	type QuestionState,
	replacementFor,
} from "./rpg-support";
export async function getAllQuestionStates(userId: string, pointId: number) {
	const rows = await db.$queryRaw<
		(QuestionState & { entryKey: string })[]
	>`SELECT "entryKey",effects,assisted FROM "RpgQuestionState" WHERE "userId"=${userId} AND "pointId"=${pointId}`;
	return Object.fromEntries(rows.map((row) => [row.entryKey, row]));
}
export async function accessiblePoint(
	tx: RpgTx,
	userId: string,
	pointId: number,
) {
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
export function publicEffects(entry: Entry, effects: QuestionEffects) {
	const effective = effectiveEntry(entry, effects);
	return {
		hint: effects.hint,
		example: effects.example,
		removed: effects.removed ?? [],
		variant: effects.replacement?.key ?? "",
		model: toStageModel(effective),
	};
}

export async function lessonCursor({
	userId,
	point,
	lesson,
	progress,
	completedAt = null,
	awards = [],
	knownEffects,
	connection = db,
}: {
	userId: string;
	point: { id: number; number: number; reward: number };
	lesson: Entry[];
	progress: LessonProgress;
	completedAt?: Date | null;
	awards?: readonly string[];
	knownEffects?: Record<string, QuestionEffects>;
	connection?: RpgTx;
}): Promise<LessonCursor> {
	const run = progress.run ?? 1;
	const all = lessonItems(lesson);
	if (completedAt) {
		const recorded = new Set(progress.completedEntries);
		return {
			kind: "finished",
			eventId: `completion:${userId}:${point.id}:${completedAt.toISOString()}`,
			xp: point.reward,
			bits: await getCompletionBits(userId, point.id, connection),
			skipped: progress.skippedEntries?.length ?? 0,
			score: lessonScore(
				all.filter(({ key }) => recorded.has(key)),
				progress,
			),
			awards: achievements
				.filter(({ id }) => awards.includes(id))
				.map(({ id, name }) => ({ id, name })),
		};
	}
	const pending = pendingItem(all, progress);
	const entry = lesson.find(({ key }) => key === pending?.key);
	if (!entry || !pending) return { kind: "lost", run };
	const { key, round } = pending;
	const review =
		round === 2
			? all.filter(
					({ key: candidate }) =>
						progress.attempts[candidate]?.[0]?.correct === false,
				)
			: [];
	let bag: LessonBagView | undefined;
	if (isGraded(entry)) {
		const effects = knownEffects
			? (knownEffects[key] ?? {})
			: (await getQuestionState(userId, point.id, key, connection)).effects;
		const effective = effectiveEntry(entry, effects);
		bag = {
			effects: {
				hint: effects.hint,
				example: effects.example,
				removed: effects.removed ?? [],
				variant: effects.replacement?.key ?? "",
				model: effects.replacement ? toStageModel(effective) : undefined,
			},
			reasons: Object.fromEntries(
				items
					.filter(
						(item) => item.kind === "consumable" && item.id !== "streak-shield",
					)
					.map((item) => [
						item.id,
						itemCompatibility(
							item.id,
							effective,
							point.number,
							round,
							progress,
							effects,
							lesson,
						),
					]),
			),
		};
	}
	return {
		kind: "step",
		key,
		round,
		run,
		lives: livesOf(progress),
		bag,
		progress: lessonProgressPercent(all, progress, round),
		reviewPosition:
			review.findIndex(({ key: candidate }) => candidate === key) + 1,
		reviewTotal: review.length,
		starting:
			progress.completedEntries.length === 0 &&
			Object.keys(progress.attempts).length === 0,
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
		getRpgSummary(userId),
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
