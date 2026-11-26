import { items, studyDay } from "~/domain/rpg";
import { db } from "~/server/db";
import {
	ensureRpg,
	grantCurrency,
	lockWallet,
	RpgError,
	readRpgInventoryState,
	readRpgState,
	settleProtection,
} from "~/server/rpg";

export async function purchaseItem(
	userId: string,
	itemId: string,
	requestId: string,
	compact = false,
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
	return compact ? readRpgInventoryState(userId) : readRpgState(userId);
}
export async function equipItem(
	userId: string,
	itemId: string,
	equipped: boolean,
	requestId: string,
	compact = false,
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
	return compact ? readRpgInventoryState(userId) : readRpgState(userId);
}
export async function armProtection(
	userId: string,
	requestId: string,
	compact = false,
) {
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
	return compact ? readRpgInventoryState(userId) : readRpgState(userId);
}
