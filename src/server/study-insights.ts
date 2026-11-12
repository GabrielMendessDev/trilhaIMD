import "server-only";
import { cache } from "react";
import { trails } from "~/app/aprender/trails";
import { dayAt, dayIndex, economy, studyDay } from "~/domain/rpg";
import { db } from "./db";
import { getLearningProgress, getPublishedPoints } from "./learning";
import { getLesson, isGraded } from "./lesson";

export const getStudyInsights = cache(async (userId: string) => {
	const [progress, catalog] = await Promise.all([
		getLearningProgress(userId),
		getPublishedPoints(),
	]);
	if (!progress) return null;
	const today = studyDay(new Date()),
		start = new Date(`${today}T03:00:00Z`),
		end = new Date(`${dayAt(dayIndex(today) + 1)}T03:00:00Z`);
	const [events] = await db.$queryRaw<
		{ answers: number; lessons: number; materials: number; bonus: boolean }[]
	>`SELECT count(*) FILTER(WHERE type='answer' AND payload->>'round'='1')::int AS answers,count(*) FILTER(WHERE type='lesson')::int AS lessons,count(*) FILTER(WHERE type='material')::int AS materials,EXISTS(SELECT 1 FROM "CurrencyTransaction" WHERE "userId"=${userId} AND key=${`daily:${today}`}) AS bonus FROM "RpgEvent" WHERE "userId"=${userId} AND "createdAt">=${start} AND "createdAt"<${end}`;
	const daily = {
		day: today,
		answers: events?.answers ?? 0,
		lessons: events?.lessons ?? 0,
		materials: events?.materials ?? 0,
		bonus: events?.bonus ?? false,
		bonusBits: economy.dailyBits,
	};
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
		const point = catalog?.find((p) => p.id === row.pointId);
		if (!point) continue;
		const lesson = await getLesson(point.id);
		for (const entry of lesson.filter(isGraded)) {
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
					topic:
						(entry.payload as { assunto?: string } | null)?.assunto ??
						"Rever o conceito",
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
	const courses = trails.map((trail) => {
		const points = catalog?.filter((p) => p.trail === trail.id) ?? [];
		const done = points.filter((p) =>
			progress.done.some((r) => r.pointId === p.id),
		).length;
		return {
			id: trail.id,
			name: trail.name,
			total: points.length,
			done,
			percent: points.length ? Math.round((done / points.length) * 100) : 0,
			started: points.some((p) =>
				progress.rows.some((r) => r.pointId === p.id),
			),
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
				: (catalog?.find((p) => p.id === row.pointId)?.title ??
					"Lição concluída"),
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
