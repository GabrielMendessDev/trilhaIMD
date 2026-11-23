import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { localLoginEnabled } from "~/server/local-login";

export async function POST(request: Request) {
	const url = new URL(request.url);
	if (
		!localLoginEnabled() ||
		!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
	) {
		return new NextResponse(null, { status: 404 });
	}
	if (request.headers.get("origin") !== url.origin)
		return new NextResponse(null, { status: 403 });
	const token = randomUUID();
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	await db.$transaction(async (tx) => {
		const user = await tx.user.upsert({
			where: { email: "estudante-local@trilbit.test" },
			update: {},
			create: {
				email: "estudante-local@trilbit.test",
				name: "Estudante de teste",
			},
		});
		await tx.session.create({
			data: { sessionToken: token, userId: user.id, expires },
		});
	});
	const response = NextResponse.redirect(new URL("/aprender", url), 303);
	response.headers.set("Cache-Control", "no-store");
	response.cookies.set("authjs.session-token", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		path: "/",
		expires,
	});
	return response;
}
