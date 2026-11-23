import "server-only";

import { cache } from "react";
import type { TrailId } from "~/app/aprender/trails";
import { db } from "~/server/db";
import { publishedCatalogCache } from "./catalog-cache";
import { summarizeCompletions } from "./learning-metrics";
import type { Attempts } from "./lesson-progress";
import { getRpgSummary } from "./rpg";

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
	skippedEntries: string[];
	deferredEntries: string[];
	completedAt: Date | null;
	xp: number;
	correctAnswers: number;
	lives: number;
	run: number;
	title: string | null;
	archived: boolean;
};

export const getPublishedPoints = cache(async () => {
	try {
		return await publishedCatalogCache(
			"points",
			() => db.$queryRaw<PublishedPoint[]>`
			SELECT p.id, p."trailSlug" AS trail, p.number, p."xpReward" AS reward,
				(SELECT a.title FROM "LearningActivity" a WHERE a."pointId" = p.id ORDER BY a.id LIMIT 1) AS title
			FROM "TrailPoint" p JOIN "LearningTrail" t ON t.slug=p."trailSlug"
			WHERE NOT t.archived AND (EXISTS (SELECT 1 FROM "TrailPointContent" c WHERE c."pointId" = p.id)
				OR EXISTS (SELECT 1 FROM "LearningActivity" a WHERE a."pointId" = p.id))
			ORDER BY p.number
		`,
		);
	} catch (error) {
		console.error(
			"Catálogo de aprendizagem indisponível",
			error instanceof Error ? error.name : error,
		);
		return null;
	}
});

export async function getCompletedLearningPoints(userId: string) {
	try {
		return await db.$queryRaw<{ pointId: number }[]>`
			SELECT "pointId" FROM "LearningPointProgress"
			WHERE "userId" = ${userId} AND "completedAt" IS NOT NULL
		`;
	} catch (error) {
		console.error(
			"Conclusões de aprendizagem indisponíveis",
			error instanceof Error ? error.name : error,
		);
		return null;
	}
}

export const getLearningRecords = cache(async (userId: string) => {
	try {
		const rows = await db.$queryRaw<Completion[]>`
			SELECT l."pointId", l."completedEntries", l.attempts, l."skippedEntries", l."deferredEntries", l."completedAt", l.xp, l."correctAnswers", l.lives, l.run, t.archived,
			(SELECT a.title FROM "LearningActivity" a WHERE a."pointId"=p.id ORDER BY a.id LIMIT 1) AS title
			FROM "LearningPointProgress" l JOIN "TrailPoint" p ON p.id=l."pointId" JOIN "LearningTrail" t ON t.slug=p."trailSlug" WHERE l."userId" = ${userId}
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

export const getLearningProgress = cache(async (userId: string) => {
	try {
		const [summary, rpg] = await Promise.all([
			getLearningRecords(userId),
			getRpgSummary(userId),
		]);
		if (!summary) return null;
		return {
			...summary,
			xp: rpg.xp,
			streak: rpg.stats.studyStreak,
			best: rpg.stats.bestStudyStreak,
			rpg,
		};
	} catch (error) {
		console.error(
			"Resumo de aprendizagem indisponível",
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
	progress: { done: readonly { pointId: number }[] } | null,
	trail: TrailId,
) {
	const published = points.filter((point) => point.trail === trail);
	const completed = published.filter((point) =>
		progress?.done.some((entry) => entry.pointId === point.id),
	);
	const next = published.find((point) => !completed.includes(point));
	return { published, completed, next };
}
