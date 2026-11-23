import "server-only";
import { livesOf } from "~/domain/lesson-lives.mjs";
import { economy } from "~/domain/rpg";
import {
	type LessonItem,
	type LessonProgress,
	lessonScore,
	pendingItem,
} from "./lesson-progress";
import {
	RpgError,
	type RpgTx,
	registerCompletionRpg,
	settleLevelRewards,
} from "./rpg";

export async function persistLesson(
	tx: RpgTx,
	userId: string,
	pointId: number,
	state: LessonProgress,
	items: LessonItem[],
	reward: number,
) {
	const pending = pendingItem(items, state);
	const failed = livesOf(state) === 0;
	const finished = !pending && !failed;
	const score = lessonScore(items, state);
	const graded = items.filter((item) => item.graded);
	const answered = graded.filter(
		(item) =>
			!state.skippedEntries?.includes(item.key) &&
			Boolean(state.attempts[item.key]?.length),
	).length;
	if (
		finished &&
		graded.length &&
		answered < Math.ceil(graded.length * economy.minimumAnswerRatio)
	)
		throw new RpgError(
			"Responda às questões mínimas da lição antes de concluir.",
		);
	const now = new Date();
	await tx.$executeRaw`UPDATE "LearningPointProgress" SET "completedEntries"=${state.completedEntries}::text[],attempts=${JSON.stringify(state.attempts)}::jsonb,"skippedEntries"=${state.skippedEntries ?? []}::text[],"deferredEntries"=${state.deferredEntries ?? []}::text[],lives=${livesOf(state)},"completedAt"=${finished ? now : null},xp=${finished ? reward : 0},"correctAnswers"=${finished ? score.first + score.recovered + score.legacy : 0} WHERE "userId"=${userId} AND "pointId"=${pointId}`;
	if (failed) {
		await tx.$executeRaw`INSERT INTO "RpgEvent" ("userId",key,type,payload) VALUES (${userId},${`lesson-failed:${pointId}:${state.run ?? 1}`},'lesson-failed',${JSON.stringify({ pointId, run: state.run ?? 1, progress: state })}::jsonb) ON CONFLICT ("userId",key) DO NOTHING`;
	}
	const review = graded.filter(
		({ key }) => state.attempts[key]?.[0]?.correct === false,
	);
	const perfect =
		graded.length > 0 &&
		graded.every(
			({ key }) =>
				state.attempts[key]?.[0]?.correct &&
				!state.attempts[key]?.[0]?.assisted,
		) &&
		!state.skippedEntries?.length;
	const recovered =
		review.length > 0 &&
		review.every(
			({ key }) =>
				state.attempts[key]?.[1]?.correct &&
				!state.attempts[key]?.some((a) => a.assisted),
		);
	const awards = finished
		? await registerCompletionRpg(tx, userId, pointId, perfect, recovered, now)
		: [];
	if (finished) await settleLevelRewards(tx, userId);
	return { pending, score, awards, failed, finished };
}
