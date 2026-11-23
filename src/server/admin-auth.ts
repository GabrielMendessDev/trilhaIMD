import "server-only";

import {
	createHash,
	createHmac,
	randomBytes,
	timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const adminCookie = "trilbit-admin";
export const adminSessionSeconds = 8 * 60 * 60;
const globalAuth = globalThis as typeof globalThis & {
	trilbitAdminKey?: Buffer;
};

function credentials() {
	const username = process.env.ADMIN_USERNAME || "admin";
	const password = process.env.ADMIN_PASSWORD || "admin";
	if (process.env.NODE_ENV === "production" && password.length < 16)
		return null;
	return { username, password };
}

const digest = (value: string) => createHash("sha256").update(value).digest();

export function adminConfigured() {
	return credentials() !== null;
}

export function adminCredentialsMatch(username: string, password: string) {
	const expected = credentials();
	if (!expected || username.length > 256 || password.length > 1024)
		return false;
	const userMatch = timingSafeEqual(
		digest(username),
		digest(expected.username),
	);
	const passMatch = timingSafeEqual(
		digest(password),
		digest(expected.password),
	);
	return userMatch && passMatch;
}

function sign(expiry: number) {
	const expected = credentials();
	if (!expected) return null;
	globalAuth.trilbitAdminKey ??= randomBytes(32);
	const secret = process.env.AUTH_SECRET || globalAuth.trilbitAdminKey;
	return createHmac("sha256", secret)
		.update(
			JSON.stringify([
				"trilbit-admin",
				expiry,
				expected.username,
				expected.password,
			]),
		)
		.digest("hex");
}

export function adminToken() {
	const expires = Math.floor(Date.now() / 1000) + adminSessionSeconds;
	return `${expires}.${sign(expires)}`;
}

export async function isAdmin() {
	const value = (await cookies()).get(adminCookie)?.value;
	if (!value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return false;
	const expiry = Number(value.slice(0, 10));
	const now = Math.floor(Date.now() / 1000);
	if (expiry <= now || expiry > now + adminSessionSeconds) return false;
	const signature = sign(expiry);
	return (
		signature !== null &&
		timingSafeEqual(
			Buffer.from(value.slice(11), "hex"),
			Buffer.from(signature, "hex"),
		)
	);
}
