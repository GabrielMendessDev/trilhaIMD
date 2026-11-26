import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

assert.equal(process.env.TRILBIT_DISPOSABLE_TEST, "1");
const origin = new URL(process.env.TRILBIT_TEST_URL).origin;
assert.equal(new URL(origin).hostname, "127.0.0.1");
assert.equal(new URL(process.env.DATABASE_URL).hostname, "127.0.0.1");
const db = new PrismaClient();

test("a Mochila consulta o histórico sob demanda e os filtros sobrevivem à recarga", {
	timeout: 180000,
}, async () => {
	const id = `teste-rpg-cache-${randomUUID()}`;
	const token = randomUUID();
	let browser;
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste de cache')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`,
			db.$executeRaw`INSERT INTO "CurrencyTransaction" ("userId",key,kind,subject,bits,xp,"balanceAfter") VALUES (${id},'fixture','test','Movimento de teste',10,0,10)`,
		]);
		const headers = { cookie: `authjs.session-token=${token}` };
		for (const path of ["/mochila", "/conquistas", "/api/rpg?history=1"]) {
			const response = await fetch(origin + path, { headers });
			assert.equal(response.status, 200, path);
			await response.arrayBuffer();
		}
		browser = await openBrowser();
		const { evaluate, go, send } = browser;
		let historyReads = 0;
		await send("Network.enable");
		browser.on("Network.requestWillBeSent", ({ request }) => {
			if (new URL(request.url).searchParams.get("history") === "1")
				historyReads++;
		});
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		await go(`${origin}/mochila`, "Sua Mochila");
		const history = "document.querySelector('#rpg-history details')";
		const hydrated = (expression) =>
			until(
				() =>
					evaluate(
						`Object.keys(${expression}??{}).some(k=>k.startsWith('__reactProps'))`,
					),
				"componente hidratado",
			);
		await hydrated(history);
		assert.equal(historyReads, 0);
		await evaluate(`${history}.querySelector('summary').click()`);
		await until(
			() => evaluate(`${history}.textContent.includes('+10 Bits')`),
			"histórico carregado",
		);
		assert.equal(historyReads, 1);
		await evaluate(`${history}.querySelector('summary').click()`);
		const usages = "document.querySelectorAll('#rpg-history details')[1]";
		await evaluate(`${usages}.querySelector('summary').click()`);
		await until(
			() =>
				evaluate(
					`${usages}.open && !${usages}.textContent.includes('Consultando histórico')`,
				),
			"histórico reutilizado",
		);
		assert.equal(historyReads, 1);

		await go(`${origin}/conquistas`, "Conquistas");
		const filter = "document.querySelector('.rpg-filters select')";
		await hydrated(filter);
		await evaluate(
			`(()=>{const s=${filter};s.value='revisao';s.dispatchEvent(new Event('change',{bubbles:true}));})()`,
		);
		await until(
			() =>
				evaluate(
					"document.querySelectorAll('.rpg-achievements>li').length===5",
				),
			"filtro salvo",
		);
		await evaluate("window.trilbitBeforeReload = true");
		await send("Page.reload");
		await until(
			() =>
				evaluate(
					`!window.trilbitBeforeReload && ${filter}?.value==='revisao' && document.querySelectorAll('.rpg-achievements>li').length===5`,
				),
			"filtro restaurado",
		);
		assert.equal(historyReads, 1);
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
