import { db } from "~/server/db";

export async function readRpgHistory(
	userId: string,
	includeUsageResult = true,
) {
	const [history, usages] = await Promise.all([
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
		>`SELECT id,"itemId",action,"createdAt","entryKey",CASE WHEN ${includeUsageResult} THEN result END AS result FROM "ItemUsage" WHERE "userId"=${userId} ORDER BY id DESC LIMIT 30`,
	]);
	return {
		history: history.map((row) => ({
			...row,
			createdAt: row.createdAt.toISOString(),
		})),
		usages: usages.map((row) => ({
			...row,
			createdAt: row.createdAt.toISOString(),
		})),
	};
}
export type RpgHistoryData = Awaited<ReturnType<typeof readRpgHistory>>;

export function readRpgProtections(userId: string) {
	return db.$queryRaw<
		{
			id: number;
			state: string;
			protectedDay: string | null;
			activatedDay: string;
		}[]
	>`SELECT id,state,"protectedDay","activatedDay" FROM "UserStreakProtection" WHERE "userId"=${userId} ORDER BY id DESC LIMIT 5`;
}
