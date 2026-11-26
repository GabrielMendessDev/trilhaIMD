import assert from "node:assert/strict";
import { test } from "node:test";
import {
	invalidateRpgHistory,
	loadRpgHistory,
} from "../src/app/_components/rpg-history-cache.ts";

const response = (account) =>
	Response.json({ account, history: [{ subject: account }], usages: [] });

test("o histórico compartilha a leitura nessa conta até expirar ou sofrer uma mutação", async (t) => {
	invalidateRpgHistory();
	let time = 1000;
	t.mock.method(Date, "now", () => time);
	const fetch = t.mock.method(globalThis, "fetch", async () => response("a"));
	const pending = loadRpgHistory("a");
	assert.equal(loadRpgHistory("a"), pending);
	assert.equal((await pending).history[0].subject, "a");
	assert.equal(loadRpgHistory("a"), pending);
	assert.equal(fetch.mock.callCount(), 1);
	time += 30_001;
	assert.notEqual(await loadRpgHistory("a"), await pending);
	invalidateRpgHistory();
	await loadRpgHistory("a");
	assert.equal(fetch.mock.callCount(), 3);
});

test("o histórico rejeita outra conta e permite nova consulta após falha", async (t) => {
	invalidateRpgHistory();
	let account = "a";
	const fetch = t.mock.method(globalThis, "fetch", async () =>
		response(account),
	);
	await loadRpgHistory("a");
	await assert.rejects(loadRpgHistory("b"), /sessão da conta mudou/);
	account = "b";
	assert.equal((await loadRpgHistory("b")).history[0].subject, "b");
	assert.equal(fetch.mock.callCount(), 3);
});
