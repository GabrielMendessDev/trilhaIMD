import { after, type NextRequest } from "next/server";
import { trails } from "~/app/aprender/trails";
import { acceptsAnalytics, recordAnswerMetrics } from "~/server/analytics";
import { auth } from "~/server/auth";
import { recordAnswer } from "~/server/lesson";
import { readRpgBalance, readRpgInventory } from "~/server/rpg";
import { lessonCursor } from "~/server/rpg-actions";

function milliseconds(raw: FormDataEntryValue | null, maximum: number) {
	if (typeof raw !== "string" || !/^\d{1,8}$/.test(raw)) return undefined;
	const value = Number(raw);
	return value <= maximum ? value : undefined;
}

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
		if (
			"analytics" in result &&
			result.analytics &&
			acceptsAnalytics(request)
		) {
			const metric = result.analytics;
			const responseMs = milliseconds(form.get("metricResponseMs"), 600_000);
			const activeMs = milliseconds(form.get("metricActiveMs"), 86_400_000);
			after(async () => {
				await recordAnswerMetrics(metric, user.id, responseMs, activeMs).catch(
					() => {
						console.error("Métricas de resposta indisponíveis.");
					},
				);
			});
		}
		const base = `/aprender/${trail.id}/${number}`;
		const destination =
			"feedback" in result && result.feedback
				? `${base}?${new URLSearchParams({ retorno: key, rodada: round })}`
				: "nextKey" in result && result.nextKey
					? `${base}?${new URLSearchParams({ item: result.nextKey })}`
					: base;
		const flow = form.get("lessonFlow") === "1";
		const view = "view" in result ? result.view : undefined;
		const awards = "awards" in result ? result.awards : undefined;
		const assessment = "assessment" in result ? result.assessment : undefined;
		const [rpg, cursor, inventory] = await Promise.all([
			!flow || assessment || view?.completedAt
				? readRpgBalance(user.id, awards).catch((error: unknown) => {
						console.error(
							"Saldo indisponível após salvar a etapa",
							error instanceof Error ? error.name : error,
						);
						return undefined;
					})
				: undefined,
			flow && view
				? lessonCursor({
						userId: user.id,
						...view,
						awards,
					})
				: undefined,
			flow &&
			(awards?.length ||
				view?.completedAt ||
				(assessment && !("analytics" in result)))
				? readRpgInventory(user.id)
						.then((stock) =>
							Object.fromEntries(
								stock.map(({ itemId, quantity }) => [itemId, quantity]),
							),
						)
						.catch(() => undefined)
				: undefined,
		]);
		return Response.json({
			destination,
			continueTo:
				"nextKey" in result && result.nextKey
					? `${base}?${new URLSearchParams({ item: result.nextKey })}`
					: base,
			assessment,
			rpg,
			cursor,
			inventory,
		});
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
