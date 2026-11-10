import "server-only";

import { cache } from "react";
import type { TrailId } from "~/app/aprender/trails";
import { db } from "~/server/db";
import { summarizeCompletions } from "./learning-metrics";
import type { Attempts } from "./lesson-progress";

export type PublishedPoint = {
	id: number;
	trail: TrailId;
	number: number;
	reward: number;
	title: string | null;
};

type Completion = {
	pointId: number;
	completedEntries: string[];
	attempts: Attempts;
	completedAt: Date | null;
	xp: number;
	correctAnswers: number;
};

export const getPublishedPoints = cache(async () => {
	try {
		return await db.$queryRaw<PublishedPoint[]>`
			SELECT p.id, p."trailSlug" AS trail, p.number, p."xpReward" AS reward,
				(SELECT a.title FROM "LearningActivity" a WHERE a."pointId" = p.id ORDER BY a.id LIMIT 1) AS title
			FROM "TrailPoint" p
			WHERE EXISTS (SELECT 1 FROM "TrailPointContent" c WHERE c."pointId" = p.id)
				OR EXISTS (SELECT 1 FROM "LearningActivity" a WHERE a."pointId" = p.id)
			ORDER BY p.number
		`;
	} catch (error) {
		console.error(
			"Catálogo de aprendizagem indisponível",
			error instanceof Error ? error.name : error,
		);
		return null;
	}
});

export const getLearningProgress = cache(async (userId: string) => {
	try {
		const rows = await db.$queryRaw<Completion[]>`
			SELECT "pointId", "completedEntries", attempts, "completedAt", xp, "correctAnswers"
			FROM "LearningPointProgress" WHERE "userId" = ${userId}
		`;
		return summarizeCompletions(rows);
	} catch (error) {
		console.error(
			"Progresso de aprendizagem indisponível",
			error instanceof Error ? error.name : error,
		);
		return null;
	}
});

export type LearningProgress = NonNullable<
	Awaited<ReturnType<typeof getLearningProgress>>
>;

export function getTrailStatus(
	points: PublishedPoint[],
	progress: LearningProgress | null,
	trail: TrailId,
) {
	const published = points.filter((point) => point.trail === trail);
	const completed = published.filter((point) =>
		progress?.done.some((entry) => entry.pointId === point.id),
	);
	const next = published.find((point) => !completed.includes(point));
	return { published, completed, next };
}
