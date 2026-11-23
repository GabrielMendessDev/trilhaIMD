import "server-only";

import { sessionIdleMs } from "~/domain/analytics";
import { dayAt, dayIndex, studyDay } from "~/domain/rpg";
import { db } from "./db";

const minimum = 5;

type Accuracy = { samples: number; correct: number };
export type RankedMetric = Accuracy & {
	id: number;
	trail: string;
	point: number;
	title: string;
};
export type CountMetric = { label: string; count: number };
export type DailyMetric = CountMetric & { kind: string; total: number };
type Timing = {
	activityId: number;
	trail: string;
	point: number;
	activity: string;
	number: number;
	prompt: string | null;
	samples: number;
	averageMs: number;
};
type Traffic = {
	accesses: number;
	sessionsMeasured: number;
	durationMs: number | null;
};

export async function readAdminMetrics() {
	const now = new Date();
	const today = studyDay(now);
	const firstDay = dayAt(dayIndex(today) - 29);
	const inactiveBefore = new Date(now.valueOf() - sessionIdleMs);
	const [
		rankings,
		timings,
		summary,
		daily,
		peaks,
		exits,
		deviceGroups,
		streak,
		hints,
		trails,
	] = await Promise.all([
		db.$queryRaw<(RankedMetric & { group: "activity" | "point" })[]>`
			WITH attempts AS (
				SELECT a.id, a.title, p.id AS "pointId", p.number AS point, t.name AS trail,
					r."userId", (r.payload->>'correct' = 'true')::int AS correct
				FROM "RpgEvent" r
				JOIN "LearningActivity" a ON a.id = CASE WHEN r.key ~ '^answer:[0-9]+:[0-9]+-[0-9]+:1$'
					THEN split_part(split_part(r.key, ':', 3), '-', 1)::int END
				JOIN "TrailPoint" p ON p.id = a."pointId"
				JOIN "LearningTrail" t ON t.slug = p."trailSlug"
				JOIN "LearningEntry" e ON e."activityId" = a.id
					AND r.key = 'answer:' || p.id || ':' || a.id || '-' || e.number || ':1'
				WHERE r.type = 'answer' AND r.key ~ '^answer:[0-9]+:[0-9]+-[0-9]+:1$'
					AND r."createdAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
					AND e.answer IS NOT NULL AND NOT t.archived
			)
			SELECT 'activity' AS "group", id, trail, point, title, count(*)::int AS samples, sum(correct)::int AS correct
			FROM attempts GROUP BY trail, "pointId", point, id, title HAVING count(DISTINCT "userId") >= ${minimum}
			UNION ALL
			SELECT 'point', "pointId", trail, point, (SELECT a.title FROM "LearningActivity" a WHERE a."pointId" = attempts."pointId" ORDER BY a.id LIMIT 1),
				count(*)::int, sum(correct)::int
			FROM attempts GROUP BY trail, "pointId", point HAVING count(DISTINCT "userId") >= ${minimum}
			ORDER BY trail, point, title
		`,
		db.$queryRaw<Timing[]>`
			SELECT t.name AS trail, p.number AS point, a.id AS "activityId", a.title AS activity, e.number, e.prompt,
				sum(d.count)::int AS samples, (sum(d.total)::numeric / sum(d.count))::float8 AS "averageMs"
			FROM "AnalyticsDaily" d
			JOIN "LearningActivity" a ON a.id = CASE WHEN d.label ~ '^[0-9]+-[0-9]+$' THEN split_part(d.label, '-', 1)::int END
			JOIN "LearningEntry" e ON e."activityId" = a.id AND d.label = a.id || '-' || e.number
			JOIN "TrailPoint" p ON p.id = a."pointId"
			JOIN "LearningTrail" t ON t.slug = p."trailSlug"
			WHERE d.kind = 'response' AND d.day >= ${firstDay} AND NOT t.archived
			GROUP BY t.name, p.number, a.id, a.title, e.number, e.prompt
			HAVING sum(d.count) >= ${minimum}
			ORDER BY t.name, p.number, a.title, e.number
		`,
		db.$queryRaw<Traffic[]>`
			SELECT count(*)::int AS accesses,
				(count(*) FILTER (WHERE "lastSeen" < ${inactiveBefore}))::int AS "sessionsMeasured",
				avg("activeMs") FILTER (WHERE "lastSeen" < ${inactiveBefore})::float8 AS "durationMs"
			FROM "AnalyticsSession"
			WHERE "startedAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
		`,
		db.$queryRaw<DailyMetric[]>`
			SELECT kind, label, sum(count)::int AS count, sum(total)::float8 AS total
			FROM "AnalyticsDaily" WHERE day >= ${firstDay} AND kind <> 'response'
			GROUP BY kind, label HAVING sum(count) >= ${minimum}
		`,
		db.$queryRaw<(CountMetric & { kind: "hour" | "day" })[]>`
			WITH entries AS (
				SELECT "startedAt" AT TIME ZONE 'America/Sao_Paulo' AS stamp FROM "AnalyticsSession"
				WHERE "startedAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
			)
			SELECT 'hour' AS kind, extract(hour FROM stamp)::int::text AS label, count(*)::int AS count
			FROM entries GROUP BY label HAVING count(*) >= ${minimum}
			UNION ALL
			SELECT 'day', extract(isodow FROM stamp)::int::text, count(*)::int
			FROM entries GROUP BY extract(isodow FROM stamp) HAVING count(*) >= ${minimum}
		`,
		db.$queryRaw<CountMetric[]>`
			SELECT screen AS label, count(*)::int AS count FROM "AnalyticsSession"
			WHERE "startedAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
				AND "lastSeen" < ${inactiveBefore}
			GROUP BY screen
		`,
		db.$queryRaw<(CountMetric & { kind: "device" | "viewport" })[]>`
			SELECT d.kind, d.label, count(*)::int AS count FROM "AnalyticsSession" s
			CROSS JOIN LATERAL (VALUES ('device', s.device), ('viewport', s.viewport)) AS d(kind, label)
			WHERE s."startedAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
			GROUP BY d.kind, d.label HAVING count(*) >= ${minimum}
		`,
		db.$queryRaw<{ best: number | null }[]>`
			SELECT CASE WHEN count(DISTINCT "userId") >= ${minimum} THEN max((payload->>'best')::int) END AS best
			FROM "RpgEvent" WHERE type = 'study' AND payload->>'best' ~ '^[0-9]+$'
		`,
		db.$queryRaw<CountMetric[]>`
			SELECT CASE "itemId" WHEN 'hint-scroll' THEN 'Pergaminho da Dica' ELSE 'Pergaminho do Exemplo' END AS label,
				count(*)::int AS count FROM "ItemUsage"
			WHERE "itemId" IN ('hint-scroll', 'example-scroll') AND action = 'use'
				AND "createdAt" >= (${firstDay}::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
			GROUP BY "itemId" HAVING count(*) >= ${minimum}
		`,
		db.$queryRaw<
			{ name: string }[]
		>`SELECT name FROM "LearningTrail" WHERE NOT archived ORDER BY name`,
	]);
	return {
		firstDay,
		today,
		rankings,
		timings,
		summary: summary[0],
		daily,
		peaks,
		exits,
		deviceGroups,
		streak: streak[0]?.best,
		hints,
		trails: trails.map(({ name }) => name),
	};
}
