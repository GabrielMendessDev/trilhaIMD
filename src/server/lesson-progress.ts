import { livesOf, remainingLives } from "../domain/lesson-lives.mjs";

export type LessonItem = { key: string; graded: boolean; topic: string };
export type Attempt = {
	correct: boolean;
	selection: string[];
	assisted?: boolean;
};
export type Attempts = Partial<Record<string, Attempt[]>>;
export type LessonProgress = {
	completedEntries: string[];
	attempts: Attempts;
	skippedEntries?: string[];
	deferredEntries?: string[];
	lives?: number;
	run?: number;
};
export type PendingItem = { key: string; round: 1 | 2 };

export function lessonProgressPercent(
	items: readonly LessonItem[],
	progress: LessonProgress,
	round: 1 | 2,
) {
	if (round === 1)
		return items.length
			? (progress.completedEntries.length / items.length) * 100
			: 0;
	const review = items.filter(
		({ key }) => progress.attempts[key]?.[0]?.correct === false,
	);
	return review.length
		? (review.filter(({ key }) => progress.attempts[key]?.length === 2).length /
				review.length) *
				100
		: 100;
}

export function pendingItem(
	items: readonly LessonItem[],
	progress: LessonProgress,
): PendingItem | undefined {
	if (livesOf(progress) === 0) return;
	const completed = new Set(progress.completedEntries);
	const deferred = new Set(progress.deferredEntries ?? []);
	const pending =
		items.find(({ key }) => !completed.has(key) && !deferred.has(key)) ??
		items.find(({ key }) => !completed.has(key));
	if (pending) return { key: pending.key, round: 1 };
	const retry = items.find(({ key, graded }) => {
		const attempts = progress.attempts[key];
		return graded && attempts?.length === 1 && !attempts[0]?.correct;
	});
	if (retry) return { key: retry.key, round: 2 };
}

export function advanceLesson(
	items: readonly LessonItem[],
	progress: LessonProgress,
	submission: PendingItem,
	attempt?: Attempt,
): LessonProgress | undefined {
	const expected = pendingItem(items, progress);
	const entry = items.find(({ key }) => key === submission.key);
	if (
		!entry ||
		entry.graded !== Boolean(attempt) ||
		expected?.key !== submission.key ||
		expected.round !== submission.round
	)
		return;

	return {
		...progress,
		lives: attempt
			? remainingLives(livesOf(progress), attempt.correct, submission.round)
			: livesOf(progress),
		completedEntries:
			submission.round === 1
				? [...progress.completedEntries, submission.key]
				: progress.completedEntries,
		attempts: attempt
			? {
					...progress.attempts,
					[submission.key]: [
						...(progress.attempts[submission.key] ?? []),
						attempt,
					],
				}
			: progress.attempts,
	};
}

export function lessonScore(
	items: readonly LessonItem[],
	progress: LessonProgress,
) {
	const completed = new Set(progress.completedEntries);
	let first = 0;
	let recovered = 0;
	let missed = 0;
	let legacy = 0;
	let total = 0;
	const topics = new Set<string>();
	for (const { key, graded, topic } of items) {
		if (!graded) continue;
		total++;
		if (progress.skippedEntries?.includes(key)) {
			missed++;
			topics.add(topic);
			continue;
		}
		const [initial, retry] = progress.attempts[key] ?? [];
		if (!initial) {
			if (completed.has(key)) legacy++;
			continue;
		}
		if (initial.correct) {
			first++;
			continue;
		}
		if (retry?.correct) recovered++;
		else if (retry) missed++;
		topics.add(topic);
	}
	return {
		total,
		first,
		recovered,
		missed,
		legacy,
		points: first + recovered * 0.5 + legacy,
		topics: [...topics],
	};
}
