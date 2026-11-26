import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

const database = { queries: 0, rows: [], error: null };
globalThis[Symbol.for("trilbit.admin-auth-test")] = database;
const mocks = {
	"server-only": "export {}",
	"next/headers":
		"export const cookies = async () => ({ get: () => undefined });",
	"./db": `export const db = { async $queryRaw() {
		const state = globalThis[Symbol.for('trilbit.admin-auth-test')];
		state.queries++;
		if (state.error) throw state.error;
		return state.rows;
	} };`,
};
const hooks = registerHooks({
	resolve(specifier, context, next) {
		if (Object.hasOwn(mocks, specifier))
			return {
				url: `data:text/javascript,${encodeURIComponent(mocks[specifier])}`,
				shortCircuit: true,
			};
		return next(specifier, context);
	},
});
const { adminCredentialsMatch, readAdminCredentials } = await import(
	"../src/server/admin-auth.ts"
);
hooks.deregister();

test("o painel aproveita a configuração salva ou oferece o primeiro acesso quando a senha do ambiente é curta", async (t) => {
	const keys = ["NODE_ENV", "ADMIN_USERNAME", "ADMIN_PASSWORD"];
	const original = Object.fromEntries(
		keys.map((key) => [key, process.env[key]]),
	);
	t.after(() => {
		for (const [key, value] of Object.entries(original)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	});
	process.env.NODE_ENV = "production";
	process.env.ADMIN_USERNAME = "admin";
	process.env.ADMIN_PASSWORD = "curta-de-teste";
	const setup = await readAdminCredentials();
	assert.deepEqual(setup, { mode: "setup", weakEnvironmentPassword: true });
	assert.equal(await adminCredentialsMatch(setup, "admin", "admin"), true);
	assert.equal(
		await adminCredentialsMatch(setup, "admin", "curta-de-teste"),
		false,
	);

	database.rows = [
		{ username: "administrador", salt: "00", passwordHash: "fixture" },
	];
	assert.equal((await readAdminCredentials()).mode, "stored");

	process.env.ADMIN_PASSWORD = "senha-de-ambiente-com-16-caracteres";
	assert.equal((await readAdminCredentials()).mode, "environment");
	assert.equal(database.queries, 2);

	delete process.env.ADMIN_PASSWORD;
	database.error = Object.assign(new Error("detalhe privado"), {
		meta: { code: "42P01" },
	});
	const log = t.mock.method(console, "error", () => {});
	assert.deepEqual(await readAdminCredentials(), { mode: "unavailable" });
	assert.equal(log.mock.calls[0].arguments.at(-1), "42P01");
	assert.ok(!log.mock.calls[0].arguments.includes("detalhe privado"));
});
