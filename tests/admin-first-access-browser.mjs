import assert from "node:assert/strict";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

assert.equal(process.env.TRILBIT_DISPOSABLE_TEST, "1");
const origin = new URL(process.env.TRILBIT_TEST_URL).origin;
assert.equal(new URL(origin).hostname, "127.0.0.1");
assert.equal(new URL(process.env.DATABASE_URL).hostname, "127.0.0.1");
assert.equal(process.env.ADMIN_USERNAME, "");
assert.equal(process.env.ADMIN_PASSWORD, "");
const setupToken = process.env.ADMIN_SETUP_TOKEN;
assert.ok(setupToken?.length >= 24);
const url = `${origin}/admin/dashboard`;

test("primeiro acesso protege as métricas, exige a troca e invalida o login temporário", {
	timeout: 120000,
}, async () => {
	const db = new PrismaClient();
	let browser;
	try {
		const warm = await fetch(url);
		assert.equal(warm.status, 200);
		await warm.arrayBuffer();
		browser = await openBrowser();
		const { evaluate, go, send } = browser;
		const see = (text) =>
			until(
				() =>
					evaluate(
						`document.querySelector('main')?.innerText.includes(${JSON.stringify(text)})`,
					),
				text,
			);
		const submit = (fields) =>
			evaluate(`(() => {
			const form = document.querySelector('main form');
			for (const [name, value] of Object.entries(${JSON.stringify(fields)})) form.elements.namedItem(name).value = value;
			form.requestSubmit();
		})()`);
		const login = (username, password) => submit({ username, password });
		await go(url, "Painel administrativo");
		await login("admin", "admin");
		await see("Configure seu acesso ao painel");
		assert.equal(
			await evaluate("document.querySelector('main dl') === null"),
			true,
		);
		const { cookies } = await send("Network.getCookies", { urls: [url] });
		const temporary = cookies.find(({ name }) => name === "trilbit-admin");
		assert.ok(temporary?.httpOnly);
		const password = "senha-longa-exclusiva-de-teste";
		const credentials = {
			username: "gestor-local",
			password,
			confirmPassword: password,
		};
		await submit({ ...credentials, setupToken: "incorreto" });
		await see("Confira o usuário");
		const [pending] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "AdminCredential"`;
		assert.equal(pending.count, 0);
		await submit({ ...credentials, setupToken });
		await see("Métricas do trilbit");
		const [saved] =
			await db.$queryRaw`SELECT username, salt, "passwordHash" FROM "AdminCredential" WHERE id=1`;
		assert.equal(saved.username, credentials.username);
		assert.match(saved.salt, /^[a-f0-9]{32}$/);
		assert.match(saved.passwordHash, /^[a-f0-9]{128}$/);

		await send("Network.setCookie", {
			name: temporary.name,
			value: temporary.value,
			url,
			path: temporary.path,
			httpOnly: true,
		});
		await go(url, "Painel administrativo");
		await login("admin", "admin");
		await see("Usuário ou senha incorretos.");
		await login(credentials.username, password);
		await see("Métricas do trilbit");
	} finally {
		await browser?.close();
		await db.$disconnect();
	}
});
