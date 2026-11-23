import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { unitOneExam } from "../src/server/me-exam-bank.mjs";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3319";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
test("prova funciona no navegador em desktop e celular", async () => {
	const id = `teste-prova-ui-${randomUUID()}`,
		token = randomUUID(),
		attempt = randomUUID();
	let browser;
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste visual')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},now()+interval '1 hour')`,
			db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",questions) VALUES (${attempt},${id},${JSON.stringify(unitOneExam)}::jsonb)`,
		]);
		await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number BETWEEN 1 AND 20`;
		browser = await openBrowser();
		await browser.send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
			sameSite: "Lax",
		});
		await browser.send("Emulation.setDeviceMetricsOverride", {
			width: 1280,
			height: 900,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await browser.go(
			`${origin}/aprender/elementar/prova-1?tentativa=${attempt}`,
			"Prova 1",
		);
		await until(
			() =>
				browser.evaluate(
					"document.querySelectorAll('input[type=radio]').length===4",
				),
			"quatro alternativas",
		);
		await browser.screenshot("prova-desktop");
		await browser.send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await browser.evaluate(
			"document.querySelector('input[type=radio]').click()",
		);
		assert.equal(
			await browser.evaluate(
				"getComputedStyle(document.querySelector('input[type=radio]')).animationName",
			),
			"choice-selected",
		);
		await browser.send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "reduce" }],
		});
		assert.equal(
			await browser.evaluate(
				"getComputedStyle(document.querySelector('input[type=radio]')).animationName",
			),
			"none",
		);
		assert.equal(
			await browser.evaluate(
				"getComputedStyle(document.querySelector('.lesson-transition')).animationName",
			),
			"none",
		);
		await browser.send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await browser.evaluate(
			"document.querySelector('input[type=radio]').click();document.querySelector('button[value=save]').click()",
		);
		await until(
			() =>
				browser.evaluate(
					"document.querySelector('input[name=question]')?.value==='u1-2'",
				),
			"resposta salva e próxima questão",
		);
		await browser.send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		assert.ok(
			await browser.evaluate(
				"document.documentElement.scrollWidth<=window.innerWidth",
			),
			"sem rolagem horizontal",
		);
		await browser.screenshot("prova-celular");
		// Uma sessão curta pode ser retomada após sair pelo mapa.
		const point = await db.trailPoint.findUniqueOrThrow({
			where: { trailSlug_number: { trailSlug: "elementar", number: 1 } },
		});
		await db.$executeRaw`DELETE FROM "LearningPointProgress" WHERE "userId"=${id}`;
		const entries =
			await db.$queryRaw`SELECT a.id::text || '-' || e.number::text AS key FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number LIMIT 6`;
		await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedEntries") VALUES (${id},${point.id},${entries.map((e) => e.key)}::text[])`;
		await browser.go(`${origin}/aprender/elementar/1`, "Sessão 2");
		await browser.screenshot("pausa-sessao-celular");
		await until(
			() =>
				browser.evaluate(
					"[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Começar esta sessão')&&Object.keys(b).some(k=>k.startsWith('__reactProps')))",
				),
			"sessão hidratada",
		);
		await browser.evaluate(
			"[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Começar esta sessão')).click()",
		);
		await until(
			() =>
				browser.evaluate("!!document.querySelector('form[action$=responder]')"),
			"lição após pausa",
		);
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
