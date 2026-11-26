import "server-only";
import {
	achievements,
	advanceStats,
	dayAt,
	dayIndex,
	economy,
	emptyStats,
	type ItemId,
	items,
	levelForXp,
	type ProgressEvent,
	rewardsForLevel,
	type Stats,
	studyDay,
	studyRuns,
} from "~/domain/rpg";
import type { Prisma } from "../../generated/prisma";
import { db } from "./db";
import type { Attempts } from "./lesson-progress";

export type RpgTx = Prisma.TransactionClient;
export class RpgError extends Error {
	status: number;
	constructor(message: string, status = 422) {
		super(message);
		this.status = status;
	}
}
type Wallet = {
	bits: number;
	achievementXp: number;
	stats: Stats;
	initialized: boolean;
	settledDay: string | null;
};
export async function lockWallet(tx: RpgTx, userId: string) {
	await tx.$executeRaw`INSERT INTO "RpgWallet"("userId") VALUES (${userId}) ON CONFLICT DO NOTHING`;
	const [wallet] = await tx.$queryRaw<
		Wallet[]
	>`SELECT bits,"achievementXp",stats,initialized,"settledDay" FROM "RpgWallet" WHERE "userId"=${userId} FOR UPDATE`;
	if (!wallet) throw new RpgError("Carteira indisponível.");
	return { ...wallet, stats: { ...emptyStats(), ...wallet.stats } };
}
async function walletIn(tx: RpgTx, userId: string) {
	const [row] = await tx.$queryRaw<
		Wallet[]
	>`SELECT bits,"achievementXp",stats,initialized,"settledDay" FROM "RpgWallet" WHERE "userId"=${userId}`;
	if (!row) throw new RpgError("Carteira indisponível.");
	return { ...row, stats: { ...emptyStats(), ...row.stats } };
}

export async function grantCurrency(
	tx: RpgTx,
	userId: string,
	key: string,
	kind: string,
	subject: string,
	bits: number,
	xp = 0,
) {
	const wallet = await walletIn(tx, userId);
	if (wallet.bits + bits < 0)
		throw new RpgError("Bits insuficientes para esta compra.");
	const inserted = await tx.$queryRaw<
		{ id: number }[]
	>`INSERT INTO "CurrencyTransaction"("userId",key,kind,subject,bits,xp,"balanceAfter") VALUES (${userId},${key},${kind},${subject},${bits},${xp},${wallet.bits + bits}) ON CONFLICT ("userId",key) DO NOTHING RETURNING id`;
	if (!inserted.length) return false;
	await tx.$executeRaw`UPDATE "RpgWallet" SET bits=bits+${bits},"achievementXp"="achievementXp"+${xp} WHERE "userId"=${userId}`;
	if (xp > 0) await settleLevelRewards(tx, userId);
	return true;
}

// Callers hold the wallet lock. Inventory, overflow Bits and the cursor commit together.
export async function settleLevelRewards(tx: RpgTx, userId: string) {
	const [wallet] = await tx.$queryRaw<{ rewardedLevel: number; xp: number }[]>`
		SELECT w."rewardedLevel", (w."achievementXp" + COALESCE((
			SELECT sum(xp) FROM "LearningPointProgress"
			WHERE "userId" = ${userId} AND "completedAt" IS NOT NULL
		), 0))::int AS xp
		FROM "RpgWallet" w WHERE w."userId" = ${userId}
	`;
	if (!wallet) throw new RpgError("Carteira indisponível.");
	const { level } = levelForXp(wallet.xp);
	if (level <= wallet.rewardedLevel) return;

	const rewards = new Map<ItemId, number>();
	for (let unlocked = wallet.rewardedLevel + 1; unlocked <= level; unlocked++) {
		for (const item of rewardsForLevel(unlocked)) {
			rewards.set(item, (rewards.get(item) ?? 0) + 1);
		}
	}
	const stock = await tx.$queryRaw<{ itemId: ItemId; quantity: number }[]>`
		SELECT "itemId", quantity FROM "InventoryItem"
		WHERE "userId" = ${userId} AND "itemId" = ANY(${[...rewards.keys()]}::text[])
	`;
	let overflowBits = 0;
	for (const item of items) {
		const earned = rewards.get(item.id);
		if (!earned) continue;
		const quantity =
			stock.find(({ itemId }) => itemId === item.id)?.quantity ?? 0;
		const added = Math.min(earned, Math.max(0, item.max - quantity));
		overflowBits += (earned - added) * Math.floor(item.price / 2);
		if (added) {
			await tx.$executeRaw`
				INSERT INTO "InventoryItem" ("userId", "itemId", quantity)
				VALUES (${userId}, ${item.id}, ${added})
				ON CONFLICT ("userId", "itemId") DO UPDATE SET quantity = "InventoryItem".quantity + EXCLUDED.quantity
			`;
		}
	}
	if (overflowBits) {
		await grantCurrency(
			tx,
			userId,
			`level-overflow:${level}`,
			"level-overflow",
			String(level),
			overflowBits,
		);
	}
	await tx.$executeRaw`UPDATE "RpgWallet" SET "rewardedLevel" = ${level} WHERE "userId" = ${userId}`;
}

export async function emitRpg(
	tx: RpgTx,
	userId: string,
	key: string,
	event: ProgressEvent,
	now = new Date(),
) {
	const inserted = await tx.$queryRaw<
		{ id: number }[]
	>`INSERT INTO "RpgEvent"("userId",key,type,payload,"createdAt") VALUES (${userId},${key},${event.kind},${JSON.stringify(event)}::jsonb,${now}) ON CONFLICT ("userId",key) DO NOTHING RETURNING id`;
	if (!inserted.length) return { fresh: false, awards: [] as string[] };
	const wallet = await walletIn(tx, userId);
	const stats = advanceStats(wallet.stats, event);
	const awards: string[] = [];
	await tx.$executeRaw`UPDATE "RpgWallet" SET stats=${JSON.stringify(stats)}::jsonb WHERE "userId"=${userId}`;
	for (const definition of achievements) {
		if (stats[definition.metric] === wallet.stats[definition.metric]) continue;
		const current = Math.min(definition.goal, stats[definition.metric]);
		await tx.$executeRaw`INSERT INTO "AchievementProgress"("userId","achievementId",current) VALUES (${userId},${definition.id},${current}) ON CONFLICT ("userId","achievementId") DO UPDATE SET current=EXCLUDED.current`;
		if (current < definition.goal) continue;
		const unlocked = await tx.$queryRaw<
			{ achievementId: string }[]
		>`INSERT INTO "UserAchievement"("userId","achievementId",xp,bits,"unlockedAt") VALUES (${userId},${definition.id},${definition.xp},${definition.bits},${now}) ON CONFLICT DO NOTHING RETURNING "achievementId"`;
		if (!unlocked.length) continue;
		await grantCurrency(
			tx,
			userId,
			`achievement:${definition.id}`,
			"achievement",
			definition.id,
			definition.bits,
			definition.xp,
		);
		awards.push(definition.id);
	}
	return { fresh: true, awards };
}

async function calendarRows(tx: RpgTx, userId: string) {
	const [days, protectedDays] = await Promise.all([
		tx.$queryRaw<
			{ day: string }[]
		>`SELECT day FROM "StudyDay" WHERE "userId"=${userId} ORDER BY day`,
		tx.$queryRaw<
			{ protectedDay: string }[]
		>`SELECT "protectedDay" FROM "UserStreakProtection" WHERE "userId"=${userId} AND state='used' ORDER BY "protectedDay"`,
	]);
	return {
		days: days.map((row) => row.day),
		protectedDays: protectedDays.map((row) => row.protectedDay),
	};
}
export async function settleProtection(
	tx: RpgTx,
	userId: string,
	now = new Date(),
) {
	const today = studyDay(now);
	const calendar = await calendarRows(tx, userId);
	const [armed] = await tx.$queryRaw<
		{ id: number; activatedDay: string }[]
	>`SELECT id,"activatedDay" FROM "UserStreakProtection" WHERE "userId"=${userId} AND state='armed'`;
	if (armed) {
		const combined = [
			...new Set([...calendar.days, ...calendar.protectedDays]),
		].sort();
		const relevant = combined.filter(
			(day) => day >= dayAt(dayIndex(armed.activatedDay) - 1),
		);
		let missing: string | undefined;
		for (let i = 0; i < relevant.length; i++) {
			const day = relevant[i];
			if (!day) continue;
			const next = relevant[i + 1] ?? today;
			if (dayIndex(next) > dayIndex(day) + 1) {
				missing = dayAt(dayIndex(day) + 1);
				break;
			}
		}
		if (missing && missing >= armed.activatedDay && missing < today) {
			const consecutive = calendar.protectedDays.includes(
				dayAt(dayIndex(missing) - 1),
			);
			if (consecutive)
				await tx.$executeRaw`UPDATE "UserStreakProtection" SET state='expired' WHERE id=${armed.id}`;
			else {
				await tx.$executeRaw`UPDATE "UserStreakProtection" SET state='used',"protectedDay"=${missing} WHERE id=${armed.id}`;
				calendar.protectedDays.push(missing);
				await tx.$executeRaw`INSERT INTO "ItemUsage"("userId","requestId","itemId",action,result,"createdAt") VALUES (${userId},${`shield-used:${armed.id}`},'streak-shield','protect',${JSON.stringify({ protectedDay: missing })}::jsonb,${now}) ON CONFLICT DO NOTHING`;
			}
		}
	}
	const run = studyRuns(calendar.days, calendar.protectedDays, today);
	const wallet = await walletIn(tx, userId);
	if (wallet.stats.studyStreak !== run.current || wallet.settledDay !== today)
		await tx.$executeRaw`UPDATE "RpgWallet" SET stats=jsonb_set(stats,'{studyStreak}',${JSON.stringify(run.current)}::jsonb),"settledDay"=${today} WHERE "userId"=${userId}`;
	return run;
}
export async function registerStudy(
	tx: RpgTx,
	userId: string,
	now = new Date(),
) {
	const day = studyDay(now);
	await tx.$executeRaw`INSERT INTO "StudyDay"("userId",day) VALUES (${userId},${day}) ON CONFLICT DO NOTHING`;
	const run = await settleProtection(tx, userId, now);
	return emitRpg(
		tx,
		userId,
		`study:${day}`,
		{ kind: "study", current: run.current, best: run.best },
		now,
	);
}
export async function registerAnswerRpg(
	tx: RpgTx,
	userId: string,
	pointId: number,
	key: string,
	round: 1 | 2,
	correct: boolean,
	assisted: boolean,
	now = new Date(),
) {
	const answer = await emitRpg(
		tx,
		userId,
		`answer:${pointId}:${key}:${round}`,
		{ kind: "answer", round, correct, assisted },
		now,
	);
	const study = answer.fresh
		? await registerStudy(tx, userId, now)
		: { awards: [] };
	return [...answer.awards, ...study.awards];
}
export async function registerCompletionRpg(
	tx: RpgTx,
	userId: string,
	pointId: number,
	perfect: boolean,
	review: boolean,
	now = new Date(),
) {
	const event = await emitRpg(
		tx,
		userId,
		`lesson:${pointId}`,
		{ kind: "lesson", perfect, review },
		now,
	);
	if (!event.fresh) return [];
	const study = await registerStudy(tx, userId, now);
	await grantCurrency(
		tx,
		userId,
		`lesson:${pointId}`,
		"lesson",
		String(pointId),
		economy.lessonBits + (perfect ? economy.perfectBits : 0),
	);
	await grantCurrency(
		tx,
		userId,
		`daily:${studyDay(now)}`,
		"daily",
		studyDay(now),
		economy.dailyBits,
	);
	const [tracks] = await tx.$queryRaw<
		{ count: number }[]
	>`SELECT count(*)::int AS count FROM "LearningTrail" t WHERE NOT t.archived AND (SELECT count(*) FROM "TrailPoint" p WHERE p."trailSlug"=t.slug)>=${economy.stagesPerTrail} AND NOT EXISTS (SELECT 1 FROM "TrailPoint" p LEFT JOIN "LearningPointProgress" l ON l."pointId"=p.id AND l."userId"=${userId} WHERE p."trailSlug"=t.slug AND (l."completedAt" IS NULL OR l."completedAt">${now}))`;
	const exploration = await emitRpg(
		tx,
		userId,
		`tracks:${tracks?.count ?? 0}`,
		{ kind: "tracks", count: tracks?.count ?? 0 },
		now,
	);
	return [...event.awards, ...study.awards, ...exploration.awards];
}

export async function ensureRpg(userId: string) {
	const now = new Date();
	const today = studyDay(now);
	const [current] = await db.$queryRaw<
		{ initialized: boolean; settledDay: string | null; rewardedLevel: number }[]
	>`
		SELECT initialized,"settledDay","rewardedLevel" FROM "RpgWallet" WHERE "userId"=${userId}`;
	if (
		current?.initialized &&
		current.settledDay === today &&
		current.rewardedLevel > 0
	)
		return;
	await db.$transaction(
		async (tx) => {
			const wallet = await lockWallet(tx, userId);
			if (!wallet.initialized) {
				// Existing completion dates are the only historical dates we can substantiate.
				const legacy = await tx.$queryRaw<
					{
						pointId: number;
						attempts: Attempts;
						completedAt: Date;
						correctAnswers: number;
					}[]
				>`SELECT "pointId",attempts,"completedAt","correctAnswers" FROM "LearningPointProgress" WHERE "userId"=${userId} AND "completedAt" IS NOT NULL ORDER BY "completedAt","pointId"`;
				const keys = legacy.length
					? await tx.$queryRaw<
							{ pointId: number; key: string }[]
						>`SELECT a."pointId", a.id::text||'-'||e.number::text AS key FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=ANY(${legacy.map(({ pointId }) => pointId)}::int[]) AND e.answer IS NOT NULL ORDER BY a."pointId", a.id, COALESCE(e.position,e.number)`
					: [];
				const keysByPoint = new Map<number, { key: string }[]>();
				for (const row of keys) {
					const pointKeys = keysByPoint.get(row.pointId);
					if (pointKeys) pointKeys.push(row);
					else keysByPoint.set(row.pointId, [row]);
				}
				for (const row of legacy) {
					const ordered = keysByPoint.get(row.pointId) ?? [];
					for (const { key } of ordered) {
						const rounds = row.attempts[key];
						for (const [index, answer] of (rounds ?? []).entries())
							await emitRpg(
								tx,
								userId,
								`answer:${row.pointId}:${key}:${index + 1}`,
								{
									kind: "answer",
									round: index === 0 ? 1 : 2,
									correct: answer.correct,
									assisted: Boolean(answer.assisted),
								},
								row.completedAt,
							);
					}
					const rounds = ordered.map(({ key }) => row.attempts[key]);
					const perfect =
						rounds.length > 0 &&
						rounds.every((a) => a?.[0]?.correct && !a[0].assisted);
					const review = rounds.filter((a) => a?.[0]?.correct === false);
					await registerCompletionRpg(
						tx,
						userId,
						row.pointId,
						perfect,
						review.length > 0 &&
							review.every(
								(a) => a?.[1]?.correct && !a.some((answer) => answer.assisted),
							),
						row.completedAt,
					);
				}
				await tx.$executeRaw`UPDATE "RpgWallet" SET initialized=true WHERE "userId"=${userId}`;
			}
			if (!wallet.initialized || wallet.settledDay !== today)
				await settleProtection(tx, userId, now);
			await settleLevelRewards(tx, userId);
		},
		{ timeout: 30000 },
	);
}
