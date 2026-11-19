import "server-only";
import { cache } from "react";
import {
	achievements,
	advanceStats,
	dayAt,
	dayIndex,
	economy,
	emptyStats,
	items,
	levelForXp,
	type ProgressEvent,
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
	return true;
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
		{ initialized: boolean; settledDay: string | null }[]
	>`
		SELECT initialized,"settledDay" FROM "RpgWallet" WHERE "userId"=${userId}`;
	if (current?.initialized && current.settledDay === today) return;
	await db.$transaction(
		async (tx) => {
			const wallet = await lockWallet(tx, userId);
			if (wallet.initialized && wallet.settledDay === today) return;
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
				for (const row of legacy) {
					const ordered = await tx.$queryRaw<
						{ key: string }[]
					>`SELECT a.id::text||'-'||e.number::text AS key FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${row.pointId} AND e.answer IS NOT NULL ORDER BY a.id,COALESCE(e.position,e.number)`;
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
			await settleProtection(tx, userId, now);
		},
		{ timeout: 30000 },
	);
}

async function readWallet(userId: string) {
	const [wallet] = await db.$queryRaw<
		(Wallet & { xp: number; protected: boolean })[]
	>`
		SELECT w.*,(w."achievementXp"+COALESCE((SELECT sum(xp) FROM "LearningPointProgress"
		WHERE "userId"=${userId} AND "completedAt" IS NOT NULL),0))::int AS xp,
		EXISTS(SELECT 1 FROM "UserStreakProtection" WHERE "userId"=${userId} AND state='armed') AS protected
		FROM "RpgWallet" w WHERE w."userId"=${userId}`;
	if (!wallet) throw new RpgError("Carteira indisponível.");
	return wallet;
}

export async function readRpgSummary(userId: string) {
	await ensureRpg(userId);
	const [wallet, inventory, unlocked, progress] = await Promise.all([
		readWallet(userId),
		db.$queryRaw<
			{ itemId: string; quantity: number; equipped: boolean }[]
		>`SELECT "itemId",quantity,equipped FROM "InventoryItem" WHERE "userId"=${userId}`,
		db.$queryRaw<
			{ achievementId: string; unlockedAt: Date; xp: number; bits: number }[]
		>`SELECT "achievementId","unlockedAt",xp,bits FROM "UserAchievement" WHERE "userId"=${userId} ORDER BY "unlockedAt" DESC`,
		db.$queryRaw<
			{ achievementId: string; current: number }[]
		>`SELECT "achievementId",current FROM "AchievementProgress" WHERE "userId"=${userId}`,
	]);
	const unlockedById = new Map(unlocked.map((row) => [row.achievementId, row]));
	const progressById = new Map(
		progress.map((row) => [row.achievementId, row.current]),
	);
	const inventoryById = new Map(inventory.map((row) => [row.itemId, row]));
	return {
		account: userId,
		bits: wallet.bits,
		xp: wallet.xp,
		achievementXp: wallet.achievementXp,
		level: levelForXp(wallet.xp),
		stats: { ...emptyStats(), ...wallet.stats },
		protected: wallet.protected,
		inventory: items.map((item) => ({
			...item,
			...(inventoryById.get(item.id) ?? { quantity: 0, equipped: false }),
		})),
		achievements: achievements.map((def) => {
			const earned = unlockedById.get(def.id);
			return {
				...def,
				xp: earned?.xp ?? def.xp,
				bits: earned?.bits ?? def.bits,
				current: progressById.get(def.id) ?? 0,
				unlockedAt: earned?.unlockedAt.toISOString() ?? null,
			};
		}),
	};
}
export const getRpgSummary = cache(readRpgSummary);

export async function readRpgState(userId: string) {
	const summary = await getRpgSummary(userId);
	const [history, usages, protections] = await Promise.all([
		db.$queryRaw<
			{
				id: number;
				kind: string;
				subject: string;
				bits: number;
				xp: number;
				balanceAfter: number;
				createdAt: Date;
			}[]
		>`SELECT id,kind,subject,bits,xp,"balanceAfter","createdAt" FROM "CurrencyTransaction" WHERE "userId"=${userId} ORDER BY id DESC LIMIT 50`,
		db.$queryRaw<
			{
				id: number;
				itemId: string;
				action: string;
				createdAt: Date;
				entryKey: string | null;
				result: unknown;
			}[]
		>`SELECT id,"itemId",action,"createdAt","entryKey",result FROM "ItemUsage" WHERE "userId"=${userId} ORDER BY id DESC LIMIT 30`,
		db.$queryRaw<
			{
				id: number;
				state: string;
				protectedDay: string | null;
				activatedDay: string;
			}[]
		>`SELECT id,state,"protectedDay","activatedDay" FROM "UserStreakProtection" WHERE "userId"=${userId} ORDER BY id DESC LIMIT 5`,
	]);
	return {
		...summary,
		history: history.map((row) => ({
			...row,
			createdAt: row.createdAt.toISOString(),
		})),
		usages: usages.map((row) => ({
			...row,
			createdAt: row.createdAt.toISOString(),
		})),
		protections,
	};
}
export const getRpgState = cache(readRpgState);
export async function getCompletionBits(userId: string, pointId: number) {
	const [result] = await db.$queryRaw<
		{ bits: number }[]
	>`SELECT COALESCE(sum(c.bits),0)::int AS bits FROM "CurrencyTransaction" c WHERE c."userId"=${userId} AND ((c.kind='lesson' AND c.subject=${String(pointId)}) OR (c.kind='daily' AND EXISTS(SELECT 1 FROM "CurrencyTransaction" l WHERE l."userId"=c."userId" AND l.kind='lesson' AND l.subject=${String(pointId)} AND l."createdAt"=c."createdAt")))`;
	return result?.bits ?? 0;
}
export type RpgState = Awaited<ReturnType<typeof readRpgState>>;
export function rpgBalance(
	state: Awaited<ReturnType<typeof readRpgSummary>>,
	awards: readonly string[] = [],
) {
	return {
		account: state.account,
		bits: state.bits,
		xp: state.xp,
		level: state.level,
		streak: state.stats.studyStreak,
		protected: state.protected,
		awards: state.achievements.filter((a) => awards.includes(a.id)),
	};
}

// Answer submissions only need balances and newly unlocked awards, not inventory/history.
export async function readRpgBalance(
	userId: string,
	awards: readonly string[] = [],
) {
	await ensureRpg(userId);
	const wallet = await readWallet(userId);
	const unlocked = awards.length
		? await db.$queryRaw<
				{
					achievementId: string;
					xp: number;
					bits: number;
					unlockedAt: Date;
				}[]
			>`SELECT "achievementId",xp,bits,"unlockedAt" FROM "UserAchievement"
		WHERE "userId"=${userId} AND "achievementId"=ANY(${[...awards]}::text[])`
		: [];
	return {
		account: userId,
		bits: wallet.bits,
		xp: wallet.xp,
		level: levelForXp(wallet.xp),
		streak: wallet.stats.studyStreak ?? 0,
		protected: wallet.protected,
		awards: unlocked.flatMap((row) => {
			const definition = achievements.find((a) => a.id === row.achievementId);
			return definition
				? [
						{
							...definition,
							xp: row.xp,
							bits: row.bits,
							current: definition.goal,
							unlockedAt: row.unlockedAt.toISOString(),
						},
					]
				: [];
		}),
	};
}

export async function purchaseItem(
	userId: string,
	itemId: string,
	requestId: string,
) {
	await ensureRpg(userId);
	const item = items.find((item) => item.id === itemId);
	if (!item) throw new RpgError("Item não encontrado.");
	await db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const [prior] = await tx.$queryRaw<
			{ subject: string }[]
		>`SELECT subject FROM "CurrencyTransaction" WHERE "userId"=${userId} AND key=${`purchase:${requestId}`}`;
		if (prior) {
			if (prior.subject !== itemId)
				throw new RpgError("Esta compra já foi usada para outro item.", 409);
			return;
		}
		const [stock] = await tx.$queryRaw<
			{ quantity: number }[]
		>`SELECT quantity FROM "InventoryItem" WHERE "userId"=${userId} AND "itemId"=${itemId}`;
		if ((stock?.quantity ?? 0) >= item.max)
			throw new RpgError(
				item.kind === "permanent"
					? "Este cosmético já é seu."
					: `Limite de ${item.max} unidades na Mochila.`,
			);
		await grantCurrency(
			tx,
			userId,
			`purchase:${requestId}`,
			"purchase",
			itemId,
			-item.price,
		);
		await tx.$executeRaw`INSERT INTO "InventoryItem"("userId","itemId",quantity) VALUES (${userId},${itemId},1) ON CONFLICT ("userId","itemId") DO UPDATE SET quantity="InventoryItem".quantity+1`;
	});
	return readRpgState(userId);
}
export async function equipItem(
	userId: string,
	itemId: string,
	equipped: boolean,
	requestId: string,
) {
	await ensureRpg(userId);
	const item = items.find((item) => item.id === itemId);
	if (item?.kind !== "permanent")
		throw new RpgError("Este item não é um cosmético equipável.");
	await db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const [prior] = await tx.$queryRaw<
			{ itemId: string; action: string }[]
		>`SELECT "itemId",action FROM "ItemUsage" WHERE "userId"=${userId} AND "requestId"=${requestId}`;
		if (prior) {
			if (
				prior.itemId !== itemId ||
				prior.action !== (equipped ? "equip" : "unequip")
			)
				throw new RpgError("Esta operação já foi usada para outra ação.", 409);
			return;
		}
		const stock = await tx.$queryRaw<
			{ quantity: number }[]
		>`SELECT quantity FROM "InventoryItem" WHERE "userId"=${userId} AND "itemId"=${itemId}`;
		if (!stock[0]?.quantity)
			throw new RpgError("Compre este cosmético antes de equipar.");
		await tx.$executeRaw`UPDATE "InventoryItem" SET equipped=${equipped} WHERE "userId"=${userId} AND "itemId"=${itemId}`;
		await tx.$executeRaw`INSERT INTO "ItemUsage"("userId","requestId","itemId",action,result) VALUES (${userId},${requestId},${itemId},${equipped ? "equip" : "unequip"},${JSON.stringify({ equipped })}::jsonb) ON CONFLICT DO NOTHING`;
	});
	return readRpgState(userId);
}
export async function armProtection(userId: string, requestId: string) {
	await ensureRpg(userId);
	await db.$transaction(async (tx) => {
		await lockWallet(tx, userId);
		const [prior] = await tx.$queryRaw<
			{ id: number; itemId: string; action: string }[]
		>`SELECT id,"itemId",action FROM "ItemUsage" WHERE "userId"=${userId} AND "requestId"=${requestId}`;
		if (prior) {
			if (prior.itemId !== "streak-shield" || prior.action !== "arm")
				throw new RpgError("Esta operação já foi usada para outra ação.", 409);
			return;
		}
		const run = await settleProtection(tx, userId);
		if (!run.current)
			throw new RpgError(
				"Comece uma ofensiva válida antes de ativar o escudo.",
			);
		const armed = await tx.$queryRaw<
			{ id: number }[]
		>`SELECT id FROM "UserStreakProtection" WHERE "userId"=${userId} AND state='armed'`;
		if (armed.length)
			throw new RpgError("Já há um escudo ativo para o próximo dia perdido.");
		const changed =
			await tx.$executeRaw`UPDATE "InventoryItem" SET quantity=quantity-1 WHERE "userId"=${userId} AND "itemId"='streak-shield' AND quantity>0`;
		if (!changed) throw new RpgError("Você não possui um Escudo da Ofensiva.");
		await tx.$executeRaw`INSERT INTO "UserStreakProtection"("userId","activatedDay") VALUES (${userId},${studyDay(new Date())})`;
		await tx.$executeRaw`INSERT INTO "ItemUsage"("userId","requestId","itemId",action,result) VALUES (${userId},${requestId},'streak-shield','arm','{"armed":true}'::jsonb)`;
	});
	return readRpgState(userId);
}
