"use server";
// Victor esteve aqui

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	adminCookie,
	adminCredentialsMatch,
	adminSession,
	adminToken,
	initializeAdmin,
	readAdminCredentials,
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
	const credentials = await readAdminCredentials();
	if (
		typeof username !== "string" ||
		typeof password !== "string" ||
		!(await adminCredentialsMatch(credentials, username, password))
	) {
		await new Promise((resolve) => setTimeout(resolve, 350));
		redirect(`${dashboard}?erro=1`);
	}
	const { value, maxAge } = adminToken(credentials);
	(await cookies()).set(adminCookie, value, { ...cookieOptions, maxAge });
	redirect(dashboard);
}

export async function completeAdminSetup(form: FormData) {
	const credentials = await readAdminCredentials();
	if ((await adminSession(credentials)) !== "setup") redirect(dashboard);
	const username = form.get("username");
	const password = form.get("password");
	const token = form.get("setupToken");
	if (
		typeof username !== "string" ||
		typeof password !== "string" ||
		password !== form.get("confirmPassword") ||
		!(await initializeAdmin(
			username.trim(),
			password,
			typeof token === "string" ? token : "",
		))
	) {
		await new Promise((resolve) => setTimeout(resolve, 350));
		redirect(`${dashboard}?erro=setup`);
	}
	const saved = await readAdminCredentials();
	if (saved.mode !== "stored") redirect(dashboard);
	const { value, maxAge } = adminToken(saved);
	(await cookies()).set(adminCookie, value, { ...cookieOptions, maxAge });
	redirect(dashboard);
}

export async function leaveAdmin() {
	(await cookies()).set(adminCookie, "", { ...cookieOptions, maxAge: 0 });
	redirect(dashboard);
}
