import "server-only";
import { cache } from "react";
import {
	achievements,
	emptyStats,
	items,
	levelProgress,
	type Stats,
} from "~/domain/rpg";
import { db } from "./db";
import { readRpgHistory, readRpgProtections } from "./rpg-history";
import { ensureRpg, RpgError, type RpgTx } from "./rpg-ledger";

export {
	emitRpg,
	ensureRpg,
	grantCurrency,
	lockWallet,
	RpgError,
	type RpgTx,
	registerAnswerRpg,
	registerCompletionRpg,
	registerStudy,
	settleLevelRewards,
	settleProtection,
} from "./rpg-ledger";

async function readWallet(userId: string) {
	const [wallet] = await db.$queryRaw<
		{
			bits: number;
			achievementXp: number;
			stats: Stats;
			xp: number;
			protected: boolean;
		}[]
	>`
		SELECT w.*,(w."achievementXp"+COALESCE((SELECT sum(xp) FROM "LearningPointProgress"
		WHERE "userId"=${userId} AND "completedAt" IS NOT NULL),0))::int AS xp,
		EXISTS(SELECT 1 FROM "UserStreakProtection" WHERE "userId"=${userId} AND state='armed') AS protected
		FROM "RpgWallet" w WHERE w."userId"=${userId}`;
	if (!wallet) throw new RpgError("Carteira indisponível.");
	return wallet;
}

export function readRpgInventory(userId: string) {
	return db.$queryRaw<
		{ itemId: string; quantity: number; equipped: boolean }[]
	>`SELECT "itemId",quantity,equipped FROM "InventoryItem" WHERE "userId"=${userId}`;
}

// Settles the wallet once per server render. Outside a render (server actions),
// React's cache does not memoize, so every call still settles the wallet.
export const ensureRpgOnce = cache(ensureRpg);

export async function readRpgSummary(userId: string) {
	await ensureRpgOnce(userId);
	const [wallet, inventory, unlocked, progress] = await Promise.all([
		readWallet(userId),
		readRpgInventory(userId),
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
		level: levelProgress(wallet.xp),
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

export async function readRpgInventoryState(userId: string) {
	const summary = await getRpgSummary(userId);
	return { ...summary, protections: await readRpgProtections(userId) };
}
export type RpgInventoryState = Awaited<
	ReturnType<typeof readRpgInventoryState>
>;

export async function readRpgState(userId: string) {
	const summary = await getRpgSummary(userId);
	const [history, protections] = await Promise.all([
		readRpgHistory(userId),
		readRpgProtections(userId),
	]);
	return { ...summary, ...history, protections };
}
export const getRpgState = cache(readRpgState);
export type RpgSummary = Awaited<ReturnType<typeof readRpgSummary>>;
export async function getCompletionBits(
	userId: string,
	pointId: number,
	connection: RpgTx = db,
) {
	const [result] = await connection.$queryRaw<
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

// Answer submissions initialize and settle the wallet before saving progress.
export async function readRpgBalance(
	userId: string,
	awards: readonly string[] = [],
) {
	const [wallet, unlocked] = await Promise.all([
		readWallet(userId),
		awards.length
			? db.$queryRaw<
					{
						achievementId: string;
						xp: number;
						bits: number;
						unlockedAt: Date;
					}[]
				>`SELECT "achievementId",xp,bits,"unlockedAt" FROM "UserAchievement"
				WHERE "userId"=${userId} AND "achievementId"=ANY(${[...awards]}::text[])`
			: [],
	]);
	return {
		account: userId,
		bits: wallet.bits,
		xp: wallet.xp,
		level: levelProgress(wallet.xp),
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
