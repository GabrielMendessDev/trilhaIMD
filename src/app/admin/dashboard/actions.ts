"use server";
// Victor esteve aqui

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	adminCookie,
	adminCredentialsMatch,
	adminSessionSeconds,
	adminToken,
} from "~/server/admin-auth";

const dashboard = "/admin/dashboard";
const cookieOptions = {
	httpOnly: true,
	sameSite: "strict",
	secure: process.env.NODE_ENV === "production",
	path: dashboard,
} as const;

export async function enterAdmin(form: FormData) {
	const username = form.get("username");
	const password = form.get("password");
	if (
		typeof username !== "string" ||
		typeof password !== "string" ||
		!adminCredentialsMatch(username, password)
	) {
		await new Promise((resolve) => setTimeout(resolve, 350));
		redirect(`${dashboard}?erro=1`);
	}
	(await cookies()).set(adminCookie, adminToken(), {
		...cookieOptions,
		maxAge: adminSessionSeconds,
	});
	redirect(dashboard);
}

export async function leaveAdmin() {
	(await cookies()).set(adminCookie, "", { ...cookieOptions, maxAge: 0 });
	redirect(dashboard);
}
