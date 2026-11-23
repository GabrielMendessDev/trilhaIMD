import { after, type NextRequest } from "next/server";
import {
	acceptsAnalytics,
	analyticsEnabled,
	analyticsEvent,
	pruneAnalytics,
	recordAnalyticsEvent,
} from "~/server/analytics";

export async function POST(request: NextRequest) {
	const host = request.headers.get("host");
	if (
		!host ||
		request.headers.get("origin") !== `${request.nextUrl.protocol}//${host}`
	) {
		return new Response(null, { status: 403 });
	}
	const body = await request.text();
	if (body.length > 1024) return new Response(null, { status: 413 });
	let raw: unknown;
	try {
		raw = JSON.parse(body);
	} catch {
		return new Response(null, { status: 400 });
	}
	const event = analyticsEvent.safeParse(raw);
	if (!event.success) return new Response(null, { status: 400 });
	if (
		!analyticsEnabled() ||
		(!acceptsAnalytics(request) && event.data.type !== "forget")
	) {
		return new Response(null, { status: 204 });
	}
	try {
		await recordAnalyticsEvent(event.data);
		after(async () => {
			await pruneAnalytics().catch(() =>
				console.error("Limpeza das métricas indisponível."),
			);
		});
		return new Response(null, { status: 204 });
	} catch {
		return new Response(null, { status: 503 });
	}
}
