import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "~/server/auth";
import { RpgError, readRpgState } from "~/server/rpg";
import {
	applyQuestionItem,
	lessonBag,
	materialAction,
	restartLesson,
} from "~/server/rpg-actions";
import { readRpgHistory } from "~/server/rpg-history";
import { armProtection, equipItem, purchaseItem } from "~/server/rpg-store";

const input = z.object({
	action: z.enum(["buy", "equip", "arm", "use", "material", "restart"]),
	lessonRun: z.number().int().positive().default(1),
	requestId: z.string().uuid().optional(),
	itemId: z.string().max(80).optional(),
	pointId: z.number().int().positive().optional(),
	entryKey: z.string().max(100).optional(),
	round: z.union([z.literal(1), z.literal(2)]).optional(),
	confirmed: z.boolean().optional(),
	equipped: z.boolean().optional(),
	answer: z.string().max(80).optional(),
	lessonFlow: z.boolean().optional(),
	compact: z.boolean().optional(),
});
export async function GET(request: NextRequest) {
	const user = (await auth())?.user;
	if (!user)
		return Response.json({ error: "Entre na sua conta." }, { status: 401 });
	try {
		if (request.nextUrl.searchParams.get("history") === "1")
			return Response.json(
				{ account: user.id, ...(await readRpgHistory(user.id, false)) },
				{ headers: { "Cache-Control": "private, no-store" } },
			);
		const point = Number(request.nextUrl.searchParams.get("pointId"));
		const entry = request.nextUrl.searchParams.get("entryKey");
		const round = request.nextUrl.searchParams.get("round") === "2" ? 2 : 1;
		return Response.json(
			point && entry
				? await lessonBag(user.id, point, entry, round)
				: await readRpgState(user.id),
			{ headers: { "Cache-Control": "private, no-store" } },
		);
	} catch (error) {
		return failure(error);
	}
}
export async function POST(request: NextRequest) {
	const host = request.headers.get("host");
	if (
		!host ||
		request.headers.get("origin") !== `${request.nextUrl.protocol}//${host}`
	)
		return Response.json({ error: "Origem inválida." }, { status: 403 });
	const user = (await auth())?.user;
	if (!user)
		return Response.json({ error: "Entre na sua conta." }, { status: 401 });
	try {
		const value = input.parse(await request.json());
		if (value.action === "restart") {
			if (!value.pointId || !value.requestId)
				throw new RpgError("Identifique a atividade e a operação.");
			return Response.json(
				await restartLesson(
					user.id,
					value.pointId,
					value.requestId,
					value.lessonRun,
					value.lessonFlow,
				),
			);
		}
		if (value.action === "material") {
			if (!value.pointId || !value.entryKey)
				throw new RpgError("Material indisponível.");
			return Response.json(
				await materialAction(
					user.id,
					value.pointId,
					value.entryKey,
					value.answer,
				),
			);
		}
		if (!value.requestId || !value.itemId)
			throw new RpgError("Identifique a operação e o item.");
		if (value.action === "buy")
			return Response.json({
				state: await purchaseItem(
					user.id,
					value.itemId,
					value.requestId,
					value.compact,
				),
			});
		if (value.action === "equip")
			return Response.json({
				state: await equipItem(
					user.id,
					value.itemId,
					Boolean(value.equipped),
					value.requestId,
					value.compact,
				),
			});
		if (value.action === "arm") {
			if (value.itemId !== "streak-shield")
				throw new RpgError("Proteção inválida.");
			return Response.json({
				state: await armProtection(user.id, value.requestId, value.compact),
			});
		}
		if (!value.pointId || !value.entryKey || !value.round)
			throw new RpgError("Questão indisponível.");
		return Response.json(
			await applyQuestionItem(
				user.id,
				value.itemId,
				value.requestId,
				value.pointId,
				value.entryKey,
				value.round,
				Boolean(value.confirmed),
				value.lessonRun,
				value.lessonFlow,
			),
		);
	} catch (error) {
		return failure(error);
	}
}
function failure(error: unknown) {
	if (error instanceof RpgError)
		return Response.json({ error: error.message }, { status: error.status });
	if (error instanceof z.ZodError)
		return Response.json(
			{ error: "Dados da operação inválidos." },
			{ status: 400 },
		);
	console.error(
		"Operação RPG indisponível",
		error instanceof Error ? error.name : error,
	);
	return Response.json(
		{ error: "Não foi possível confirmar a operação. Tente novamente." },
		{ status: 500 },
	);
}
