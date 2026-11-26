import "server-only";

import {
	createHash,
	createHmac,
	randomBytes,
	scrypt,
	timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "./db";

export const adminCookie = "trilbit-admin";
const sessionSeconds = { admin: 8 * 60 * 60, setup: 15 * 60 };
const globalAuth = globalThis as typeof globalThis & {
	trilbitAdminKey?: Buffer;
};
const derive = promisify(scrypt);

type StoredCredential = {
	username: string;
	salt: string;
	passwordHash: string;
};
type AdminCredentials =
	| { mode: "setup" }
	| { mode: "disabled" }
	| { mode: "environment"; username: string; password: string }
	| ({ mode: "stored" } & StoredCredential);

export async function readAdminCredentials(): Promise<AdminCredentials> {
	const username = process.env.ADMIN_USERNAME?.trim();
	const password = process.env.ADMIN_PASSWORD;
	if (username && password && !(username === "admin" && password === "admin")) {
		if (process.env.NODE_ENV === "production" && password.length < 16)
			return { mode: "disabled" };
		return { mode: "environment", username, password };
	}
	const [saved] = await db.$queryRaw<StoredCredential[]>`
		SELECT username, salt, "passwordHash" FROM "AdminCredential" WHERE id = 1
	`;
	return saved ? { mode: "stored", ...saved } : { mode: "setup" };
}

const digest = (value: string) => createHash("sha256").update(value).digest();
const equal = (left: string, right: string) =>
	timingSafeEqual(digest(left), digest(right));

async function hashPassword(password: string, salt: string) {
	return (
		(await derive(password, Buffer.from(salt, "hex"), 64)) as Buffer
	).toString("hex");
}

export async function adminCredentialsMatch(
	expected: AdminCredentials,
	username: string,
	password: string,
) {
	if (
		expected.mode === "disabled" ||
		username.length > 256 ||
		password.length > 1024
	)
		return false;
	if (expected.mode === "stored") {
		const hash = await hashPassword(password, expected.salt);
		return (
			equal(username, expected.username) && equal(hash, expected.passwordHash)
		);
	}
	const userMatch = equal(
		username,
		expected.mode === "setup" ? "admin" : expected.username,
	);
	const passMatch = equal(
		password,
		expected.mode === "setup" ? "admin" : expected.password,
	);
	return userMatch && passMatch;
}

export function adminSetupRequiresToken() {
	return (
		process.env.NODE_ENV === "production" ||
		Boolean(process.env.ADMIN_SETUP_TOKEN)
	);
}

export function adminSetupAvailable() {
	return (
		!adminSetupRequiresToken() ||
		(process.env.ADMIN_SETUP_TOKEN?.length ?? 0) >= 24
	);
}

export async function initializeAdmin(
	username: string,
	password: string,
	token: string,
) {
	if (
		username.length < 3 ||
		username.length > 128 ||
		password.length < 16 ||
		password.length > 1024 ||
		!password.trim() ||
		username === password ||
		(adminSetupRequiresToken() &&
			(!adminSetupAvailable() ||
				token.length > 1024 ||
				!equal(token, process.env.ADMIN_SETUP_TOKEN ?? "")))
	)
		return false;

	const salt = randomBytes(16).toString("hex");
	const hash = await hashPassword(password, salt);
	return (
		(await db.$executeRaw`
		INSERT INTO "AdminCredential" (id, username, salt, "passwordHash")
		VALUES (1, ${username}, ${salt}, ${hash})
		ON CONFLICT (id) DO NOTHING
	`) === 1
	);
}

function scope(expected: AdminCredentials) {
	if (expected.mode === "disabled") return null;
	return expected.mode === "setup" ? "setup" : "admin";
}

function sign(expected: AdminCredentials, expiry: number) {
	globalAuth.trilbitAdminKey ??= randomBytes(32);
	const secret = process.env.AUTH_SECRET || globalAuth.trilbitAdminKey;
	const payload =
		expected.mode === "environment"
			? ["trilbit-admin", expiry, expected.username, expected.password]
			: expected.mode === "stored"
				? [
						"trilbit-admin",
						"stored",
						expiry,
						expected.username,
						expected.passwordHash,
					]
				: ["trilbit-admin", "setup", expiry];
	return createHmac("sha256", secret)
		.update(JSON.stringify(payload))
		.digest("hex");
}

export function adminToken(expected: AdminCredentials) {
	const kind = scope(expected);
	if (!kind) throw new Error("Painel administrativo indisponível.");
	const maxAge = sessionSeconds[kind];
	const expires = Math.floor(Date.now() / 1000) + maxAge;
	return { value: `${expires}.${sign(expected, expires)}`, maxAge };
}

export async function adminSession(expected: AdminCredentials) {
	const value = (await cookies()).get(adminCookie)?.value;
	const kind = scope(expected);
	if (!kind || !value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return null;
	const expiry = Number(value.slice(0, 10));
	const now = Math.floor(Date.now() / 1000);
	if (expiry <= now || expiry > now + sessionSeconds[kind]) return null;
	return equal(value.slice(11), sign(expected, expiry)) ? kind : null;
}
