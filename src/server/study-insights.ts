import "server-only";
import { cache } from "react";
import { trails } from "~/app/aprender/trails";
import { dayAt, dayIndex, economy, studyDay } from "~/domain/rpg";
import { publishedCatalogCache } from "./catalog-cache";
import { db } from "./db";
import { getLearningRecords, getPublishedPoints } from "./learning";
import { ensureRpg } from "./rpg";

const getQuestionMetadata = cache(() =>
	publishedCatalogCache(
		"question-metadata",
		() =>
			db.$queryRaw<{ pointId: number; key: string; topic: string | null }[]>`
		SELECT a."pointId", a.id::text || '-' || e.number::text AS key, e.payload->>'assunto' AS topic
		FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id
		JOIN "TrailPoint" p ON p.id=a."pointId" JOIN "LearningTrail" t ON t.slug=p."trailSlug"
		WHERE NOT t.archived AND e.type IS NOT NULL AND e.type <> 'WALKTHROUGH'
		ORDER BY a.id, COALESCE(e.position,e.number), e.number`,
	),
);

export const getDailyMissions = cache(async (userId: string) => {
	await ensureRpg(userId);
	const today = studyDay(new Date()),
		start = new Date(`${today}T03:00:00Z`),
		end = new Date(`${dayAt(dayIndex(today) + 1)}T03:00:00Z`);
	const [events] = await db.$queryRaw<
		{ answers: number; lessons: number; materials: number; bonus: boolean }[]
	>`SELECT count(*) FILTER(WHERE type='answer' AND payload->>'round'='1')::int AS answers,count(*) FILTER(WHERE type='lesson')::int AS lessons,count(*) FILTER(WHERE type='material')::int AS materials,EXISTS(SELECT 1 FROM "CurrencyTransaction" WHERE "userId"=${userId} AND key=${`daily:${today}`}) AS bonus FROM "RpgEvent" WHERE "userId"=${userId} AND "createdAt">=${start} AND "createdAt"<${end}`;
	return {
		day: today,
		answers: events?.answers ?? 0,
		lessons: events?.lessons ?? 0,
		materials: events?.materials ?? 0,
		bonus: events?.bonus ?? false,
		bonusBits: economy.dailyBits,
	};
});

export type DailyMissions = Awaited<ReturnType<typeof getDailyMissions>>;

export const getStudyInsights = cache(async (userId: string) => {
	const [progress, catalog, daily] = await Promise.all([
		getLearningRecords(userId),
		getPublishedPoints(),
		getDailyMissions(userId),
	]);
	if (!progress) return null;
	const pointsById = new Map(catalog?.map((point) => [point.id, point]));
	const pointIds = new Set(
		progress.rows
			.filter((row) => pointsById.has(row.pointId))
			.map((row) => row.pointId),
	);
	// Recommendations need identity and topic only, never lesson content or answer keys.
	const questions = pointIds.size
		? (await getQuestionMetadata()).filter((q) => pointIds.has(q.pointId))
		: [];
	const questionsByPoint = new Map<number, typeof questions>();
	for (const question of questions) {
		const group = questionsByPoint.get(question.pointId) ?? [];
		group.push(question);
		questionsByPoint.set(question.pointId, group);
	}
	let attempted = 0,
		first = 0,
		recovered = 0,
		missed = 0;
	const review: {
		key: string;
		pointId: number;
		trail: string;
		number: number;
		title: string;
		topic: string;
		href: string;
		kind: "pending" | "missed" | "recovered" | "skipped";
	}[] = [];
	for (const row of progress.rows) {
		const point = pointsById.get(row.pointId);
		if (!point) continue;
		for (const entry of questionsByPoint.get(point.id) ?? []) {
			const attempts = row.attempts[entry.key] ?? [];
			const a = attempts[0],
				retry = attempts[1];
			if (a) {
				attempted++;
				if (a.correct) first++;
				else if (retry?.correct) recovered++;
				else if (retry) missed++;
			}
			const skipped = row.skippedEntries.includes(entry.key);
			if ((a && !a.correct) || skipped) {
				const kind = skipped
					? "skipped"
					: retry
						? retry.correct
							? "recovered"
							: "missed"
						: "pending";
				review.push({
					key: entry.key,
					pointId: point.id,
					trail: point.trail,
					number: point.number,
					title: point.title ?? `Lição ${point.number}`,
					topic: entry.topic ?? "Rever o conceito",
					kind,
					href:
						row.completedAt && !skipped
							? `/aprender/${point.trail}/${point.number}?retorno=${entry.key}&rodada=${retry ? 2 : 1}`
							: row.completedAt
								? `/aprender/${point.trail}/${point.number}?item=${entry.key}`
								: `/aprender/${point.trail}/${point.number}`,
				});
			}
		}
	}
	const priority = { pending: 0, missed: 1, skipped: 2, recovered: 3 };
	review.sort((a, b) => priority[a.kind] - priority[b.kind]);
	const completedIds = new Set(progress.done.map((row) => row.pointId));
	const startedIds = new Set(progress.rows.map((row) => row.pointId));
	const courses = trails.map((trail) => {
		const points = catalog?.filter((p) => p.trail === trail.id) ?? [];
		const done = points.filter((p) => completedIds.has(p.id)).length;
		return {
			id: trail.id,
			name: trail.name,
			total: points.length,
			done,
			percent: points.length ? Math.round((done / points.length) * 100) : 0,
			started: points.some((p) => startedIds.has(p.id)),
		};
	});
	const history = [...progress.done]
		.sort(
			(a, b) =>
				(a.completedAt?.getTime() ?? 0) - (b.completedAt?.getTime() ?? 0),
		)
		.map((row) => ({
			pointId: row.pointId,
			title: row.archived
				? `${row.title ?? "Lição concluída"} · versão anterior`
				: (pointsById.get(row.pointId)?.title ?? "Lição concluída"),
			at: row.completedAt?.toISOString() ?? null,
			xp: row.xp,
		}));
	return {
		daily,
		attempted,
		first,
		recovered,
		missed,
		accuracy: attempted ? Math.round((first / attempted) * 100) : null,
		review,
		courses,
		history,
		bestCourse:
			courses
				.filter((c) => c.done > 0)
				.sort((a, b) => b.percent - a.percent)[0] ?? null,
		activeCourses: courses.filter((c) => c.started && c.done < c.total).length,
	};
});
export type StudyInsights = NonNullable<
	Awaited<ReturnType<typeof getStudyInsights>>
>;
