import type { NextRequest } from "next/server";
import { trails } from "~/app/aprender/trails";
import { auth } from "~/server/auth";
import { recordAnswer } from "~/server/lesson";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ modulo: string; etapa: string }> },
) {
	const host = request.headers.get("host");
	if (
		!host ||
		request.headers.get("origin") !== `${request.nextUrl.protocol}//${host}`
	) {
		return Response.json({ error: "Origem inválida." }, { status: 403 });
	}
	const user = (await auth())?.user;
	if (!user) {
		return Response.json(
			{ error: "Entre na sua conta para salvar seu progresso." },
			{ status: 401 },
		);
	}
	const { modulo, etapa } = await params;
	const trail = trails.find(({ id }) => id === modulo);
	const number = Number(etapa);
	if (!trail || String(number) !== etapa || !trail.positions[number - 1]) {
		return Response.json({ error: "Etapa indisponível." }, { status: 404 });
	}

	try {
		const form = await request.formData();
		const key = form.get("item");
		const round = form.get("rodada");
		if (typeof key !== "string" || (round !== "1" && round !== "2")) {
			return Response.json({ error: "Item indisponível." }, { status: 400 });
		}
		const result = await recordAnswer(
			user.id,
			trail.id,
			number,
			{ key, round: round === "1" ? 1 : 2 },
			form,
		);
		if (result.error) {
			return Response.json({ error: result.error }, { status: 422 });
		}
		const base = `/aprender/${trail.id}/${number}`;
		const destination =
			"feedback" in result && result.feedback
				? `${base}?${new URLSearchParams({ retorno: key, rodada: round })}`
				: base;
		return Response.json({ destination });
	} catch (error) {
		console.error(
			"Falha ao salvar a etapa",
			error instanceof Error ? error.name : error,
		);
		return Response.json(
			{ error: "Não foi possível salvar. Tente novamente." },
			{ status: 500 },
		);
	}
}
