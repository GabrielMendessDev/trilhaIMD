import "server-only";

import type { TrailId } from "~/app/aprender/trails";
import { livesOf } from "~/domain/lesson-lives.mjs";
import { db } from "~/server/db";
import {
	getCompletedLearningPoints,
	getPublishedPoints,
	getTrailStatus,
} from "./learning";
import { getLesson } from "./lesson-catalog";
import {
	type Entry,
	feedbackFor,
	grade,
	isGraded,
	lessonItems,
} from "./lesson-content";
import {
	type Attempt,
	advanceLesson,
	type LessonProgress,
	lessonProgressPercent,
	type PendingItem,
	pendingItem,
} from "./lesson-progress";
import { persistLesson } from "./lesson-state";
import { ensureRpg, lockWallet, registerAnswerRpg } from "./rpg";
import {
	effectiveEntry,
	getQuestionState,
	type QuestionState,
} from "./rpg-support";

export { getLesson, getLessonCatalog } from "./lesson-catalog";
export {
	type Entry,
	feedbackFor,
	isGraded,
	lessonItems,
	toStageModel,
} from "./lesson-content";

export async function readLessonProgress(userId: string, pointId: number) {
	const [progress] = await db.$queryRaw<
		(LessonProgress & { completedAt: Date | null; xp: number })[]
	>`SELECT "completedEntries", attempts, "skippedEntries", "deferredEntries", "completedAt", lives, run, xp
		FROM "LearningPointProgress" WHERE "userId"=${userId} AND "pointId"=${pointId}`;
	return progress;
}

export async function recordAnswer(
	userId: string,
	trail: TrailId,
	number: number,
	submission: PendingItem,
	form: FormData,
) {
	const [points, done] = await Promise.all([
		getPublishedPoints(),
		getCompletedLearningPoints(userId),
	]);
	if (!points || !done)
		return { error: "O progresso está indisponível. Tente novamente." };
	const { published, completed, next } = getTrailStatus(
		points,
		{ done },
		trail,
	);
	const point = published.find((point) => point.number === number);
	if (!point || (point.id !== next?.id && !completed.includes(point))) {
		return { error: "Conclua a etapa disponível no mapa para continuar." };
	}
	const entries = await getLesson(point.id);
	const original = entries.find((entry) => entry.key === submission.key);
	if (!original)
		return { error: "A etapa mudou. Atualize a página antes de continuar." };
	let entry: Entry = original;
	const items = lessonItems(entries);
	await ensureRpg(userId);
	const assessment = (
		answer: Attempt,
		state: LessonProgress,
		finished: boolean,
	) => ({
		...feedbackFor(entry, answer, submission.round),
		correct: answer.correct,
		round: submission.round,
		selection: answer.selection,
		finished,
		lives: livesOf(state),
		failed: livesOf(state) === 0,
		progress: lessonProgressPercent(items, state, submission.round),
		eventId: `answer:${userId}:${point.id}:${entry.key}:${submission.round}:run-${state.run ?? 1}`,
	});

	return db.$transaction(
		async (tx) => {
			await lockWallet(tx, userId);
			const support: QuestionState = isGraded(original)
				? await getQuestionState(userId, point.id, submission.key, tx)
				: { effects: {}, assisted: false };
			entry = effectiveEntry(original as Entry, support.effects);
			if (
				(form.get("variant") ?? "") !== (support.effects.replacement?.key ?? "")
			)
				return {
					error:
						"A questão foi atualizada. Atualize a tela antes de responder.",
				};
			const attempt = isGraded(entry) ? grade(entry, form) : undefined;
			if (isGraded(entry) && !attempt)
				return { error: "Preencha todos os campos da questão para responder." };
			if (entry.type === "WALKTHROUGH" && form.get("resposta") !== "concluido")
				return { error: "Percorra todos os passos antes de continuar." };

			if (attempt) {
				if (
					attempt.selection.some((id) => support.effects.removed?.includes(id))
				)
					return { error: "Uma alternativa removida não pode ser enviada." };
				attempt.assisted = support.assisted;
			}
			await tx.$executeRaw`
			INSERT INTO "LearningPointProgress" ("userId", "pointId") VALUES (${userId}, ${point.id})
			ON CONFLICT ("userId", "pointId") DO NOTHING
		`;
			const [row] = await tx.$queryRaw<
				(LessonProgress & { completedAt: Date | null })[]
			>`
			SELECT "completedEntries", attempts, "skippedEntries", "deferredEntries", "completedAt", lives, run FROM "LearningPointProgress"
			WHERE "userId" = ${userId} AND "pointId" = ${point.id} FOR UPDATE
		`;
			if (!row)
				return { error: "O progresso está indisponível. Tente novamente." };
			if (Number(form.get("run") ?? 1) !== (row.run ?? 1))
				return {
					error:
						"A atividade foi recomeçada. Atualize a tela antes de responder.",
				};
			const saved = row.attempts[submission.key]?.[submission.round - 1];
			const view = (progress: LessonProgress, completedAt: Date | null) => ({
				point,
				lesson: entries,
				progress,
				completedAt,
			});
			if (saved) {
				const same =
					attempt &&
					saved.selection.length === attempt.selection.length &&
					saved.selection.every(
						(value, index) => value === attempt.selection[index],
					);
				return same
					? {
							feedback: true,
							assessment: assessment(saved, row, Boolean(row.completedAt)),
							nextKey: pendingItem(items, row)?.key,
							view: view(row, row.completedAt),
						}
					: { error: "A resposta desta rodada já foi registrada." };
			}
			if (row.completedAt)
				return { finished: true, view: view(row, row.completedAt) };
			if (livesOf(row) === 0)
				return {
					error: "As vidas acabaram. Recomece a atividade para continuar.",
				};
			const updated = advanceLesson(items, row, submission, attempt);
			if (!updated) {
				if (!isGraded(entry) && row.completedEntries.includes(submission.key))
					return {
						continued: true,
						nextKey: pendingItem(items, row)?.key,
						view: view(row, row.completedAt),
					};
				return {
					error:
						"Esta tela já avançou ou pertence a outra rodada. Atualize a lição para continuar.",
				};
			}
			const awards = attempt
				? await registerAnswerRpg(
						tx,
						userId,
						point.id,
						submission.key,
						submission.round,
						attempt.correct,
						Boolean(attempt.assisted),
					)
				: [];
			const persisted = await persistLesson(
				tx,
				userId,
				point.id,
				updated,
				items,
				point.reward,
			);
			const upcoming = persisted.pending;
			awards.push(...persisted.awards);
			return attempt
				? {
						feedback: true,
						assessment: assessment(attempt, updated, persisted.finished),
						nextKey: upcoming?.key,
						view: view(updated, persisted.completedAt),
						awards,
						analytics: {
							pointId: point.id,
							entryKey: entry.key,
							run: row.run ?? 1,
							round: submission.round,
							correct: attempt.correct,
							replaced: Boolean(support.effects.replacement),
							assisted:
								Boolean(attempt.assisted) ||
								Boolean(support.effects.replacement),
						},
					}
				: {
						continued: true,
						nextKey: upcoming?.key,
						awards,
						view: view(updated, persisted.completedAt),
					};
		},
		{ timeout: 15000 },
	);
}
