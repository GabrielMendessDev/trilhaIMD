type Completion = {
	pointId: number;
	completedAt: Date | null;
	xp: number;
	correctAnswers: number;
};
const calendar = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Sao_Paulo",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});
function dayNumber(date: Date) {
	const parts = Object.fromEntries(
		calendar.formatToParts(date).map(({ type, value }) => [type, value]),
	);
	return (
		Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) /
		86_400_000
	);
}

export function summarizeCompletions<T extends Completion>(
	rows: T[],
	now = new Date(),
) {
	const done = rows.filter((row) => row.completedAt !== null);
	const dates = [
		...new Set(done.map((row) => dayNumber(row.completedAt as Date))),
	].sort((a, b) => a - b);
	let last = Number.NEGATIVE_INFINITY;
	let run = 0;
	let best = 0;
	for (const date of dates) {
		run = date === last + 1 ? run + 1 : 1;
		best = Math.max(best, run);
		last = date;
	}
	return {
		rows,
		done,
		xp: done.reduce((sum, row) => sum + row.xp, 0),
		correct: done.reduce((sum, row) => sum + row.correctAnswers, 0),
		streak: dayNumber(now) - last <= 1 ? run : 0,
		best,
	};
}

export const achievementDefinitions = [
	{
		id: "first-step",
		name: "Primeiro passo",
		condition: "Conclua a primeira etapa.",
		icon: "star",
		tone: "orbit",
	},
	{
		id: "steady-rhythm",
		name: "Ritmo constante",
		condition: "Conclua etapas por três dias consecutivos.",
		icon: "fire",
		tone: "solar",
	},
	{
		id: "sharp-mind",
		name: "Mente afiada",
		condition: "Acerte 25 questões em etapas concluídas.",
		icon: "bolt",
		tone: "mint",
	},
] as const;

export function earnedAchievements(progress: {
	done: unknown[];
	best: number;
	correct: number;
}) {
	return achievementDefinitions.filter(({ id }) => {
		if (id === "first-step") return progress.done.length > 0;
		if (id === "steady-rhythm") return progress.best >= 3;
		return progress.correct >= 25;
	});
}

export function newAchievementsAt(rows: Completion[], pointId: number) {
	const target = rows.find((row) => row.pointId === pointId);
	if (!target?.completedAt) return [];
	const cutoff = target.completedAt.getTime();
	const before = rows.filter(
		(row) =>
			row.completedAt &&
			(row.completedAt.getTime() < cutoff ||
				(row.completedAt.getTime() === cutoff && row.pointId < pointId)),
	);
	const previous = new Set(
		earnedAchievements(summarizeCompletions(before)).map(({ id }) => id),
	);
	return earnedAchievements(summarizeCompletions([...before, target])).filter(
		({ id }) => !previous.has(id),
	);
}
