import Link from "~/app/_components/action-link";
import { livesOf } from "~/domain/lesson-lives.mjs";
import { auth } from "~/server/auth";
import type { PublishedPoint } from "~/server/learning";
import {
	getCompletedLearningPoints,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import {
	feedbackFor,
	getLessonCatalog,
	isGraded,
	lessonItems,
	readLessonProgress,
	toStageModel,
} from "~/server/lesson";
import {
	type LessonProgress,
	lessonProgressPercent,
} from "~/server/lesson-progress";
import { getRpgSummary } from "~/server/rpg";
import { getAllQuestionStates, lessonCursor } from "~/server/rpg-actions";
import { effectiveEntry } from "~/server/rpg-support";
import { trailMapHref } from "../trails";
import { LessonPlayer } from "./lesson-player";
import type { RestoredAnswer } from "./lesson-view";

const emptyProgress: LessonProgress = { completedEntries: [], attempts: {} };

export async function PublishedLesson({
	point,
	entryKey,
	feedbackKey,
	feedbackRound,
	materialKey,
}: {
	point: PublishedPoint;
	entryKey?: string;
	feedbackKey?: string;
	feedbackRound: 1 | 2;
	materialKey?: string;
}) {
	const { trail, number, id } = point;
	const base = `/aprender/${trail}/${number}`;
	const [catalog, { entries: lesson, screens, materials }, student] =
		await Promise.all([
			getPublishedPoints(),
			getLessonCatalog(id),
			auth().then(async (session) => {
				const user = session?.user;
				const data = user
					? await Promise.all([
							getCompletedLearningPoints(user.id),
							readLessonProgress(user.id, id),
							getRpgSummary(user.id),
							getAllQuestionStates(user.id, id),
						]).catch(() => null)
					: null;
				return { user, data };
			}),
		]);
	const { user, data } = student;
	const [done, row, rpg] = data ?? [null, undefined, null];
	const questionStates: Awaited<ReturnType<typeof getAllQuestionStates>> =
		data?.[3] ?? {};
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		done ? { done } : null,
		trail,
	);
	const state = row ?? emptyProgress;
	const locked = Boolean(user && done && !row?.completedAt && next?.id !== id);
	const upcoming = published.find(
		({ number: step }) =>
			step > number && !completed.some(({ number: done }) => done === step),
	);
	const completionTime = row?.completedAt?.getTime();
	const awards =
		completionTime === undefined
			? []
			: (rpg?.achievements ?? [])
					.filter(
						(award) =>
							award.unlockedAt &&
							Math.abs(new Date(award.unlockedAt).getTime() - completionTime) <
								2000,
					)
					.map(({ id }) => id);
	const cursor =
		user && done && !locked && lesson.length > 0
			? await lessonCursor({
					userId: user.id,
					point: row?.completedAt ? { ...point, reward: row.xp } : point,
					lesson,
					progress: state,
					completedAt: row?.completedAt,
					awards,
					knownEffects: Object.fromEntries(
						Object.entries(questionStates).map(([key, value]) => [
							key,
							value.effects,
						]),
					),
				})
			: undefined;

	const original =
		!locked && feedbackKey
			? lesson.find(({ key }) => key === feedbackKey)
			: undefined;
	const attempt = original && state.attempts[original.key]?.[feedbackRound - 1];
	let feedback: RestoredAnswer | undefined;
	if (user && original && attempt) {
		const saved = questionStates[original.key]?.effects ?? {};
		const entry = effectiveEntry(original, saved);
		if (isGraded(entry)) {
			feedback = {
				key: original.key,
				assessment: {
					...feedbackFor(entry, attempt, feedbackRound),
					correct: attempt.correct,
					round: feedbackRound,
					selection: attempt.selection,
					lives: livesOf(state),
					finished: Boolean(row?.completedAt),
					failed: livesOf(state) === 0,
					progress: lessonProgressPercent(
						lessonItems(lesson),
						state,
						feedbackRound,
					),
					eventId: `answer:${user.id}:${id}:${original.key}:${feedbackRound}:run-${state.run ?? 1}`,
				},
				effects: {
					variant: saved.replacement?.key ?? "",
					hint: saved.hint,
					example: saved.example,
					removed: saved.removed ?? [],
					model: saved.replacement ? toStageModel(entry) : undefined,
				},
			};
		}
	}

	return (
		<LessonPlayer
			base={base}
			completionMapHref={trailMapHref(trail, upcoming?.number ?? number)}
			exam={trail === "elementar" && number === 20}
			initialCursor={cursor}
			initialFeedback={feedback}
			initialInventory={Object.fromEntries(
				(rpg?.inventory ?? []).map(({ id, quantity }) => [id, quantity]),
			)}
			initialMaterial={materialKey}
			initialReading={
				row?.completedAt && entryKey
					? (screens.find(({ key }) => key === entryKey) ?? screens[0])?.key
					: undefined
			}
			key={`${base}:${user?.id ?? "guest"}`}
			mapHref={trailMapHref(trail, number)}
			materials={materials}
			playable={Boolean(user && done && !locked)}
			pointId={id}
			screens={locked ? [] : screens}
			signedIn={Boolean(user)}
			title={point.title ?? `Ponto ${number}`}
			unavailable={
				locked ? (
					<div className="mt-4 space-y-4">
						<section className="ui-panel p-5">
							<h2 className="font-extrabold text-xl">Etapa bloqueada</h2>
							<p className="ui-muted mt-2">
								Conclua a etapa {next?.number} para avançar no mapa.
							</p>
							<Link
								className="ui-button mt-4"
								href={trailMapHref(trail, next?.number)}
							>
								Voltar ao percurso
							</Link>
						</section>
					</div>
				) : undefined
			}
			upcoming={upcoming?.number}
			usesSessions={trail === "elementar"}
		/>
	);
}
