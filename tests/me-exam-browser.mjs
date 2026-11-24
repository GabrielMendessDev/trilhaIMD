import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { getExamDefinition } from "../src/server/me-exam-bank.mjs";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3319";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
for (const unit of [1, 2, 3])
	test(`Prova ${unit} funciona em desktop/celular e movimento reduzido`, async () => {
		const db = new PrismaClient();
		const questions = getExamDefinition(unit).questions;
		const base = `${origin}/aprender/elementar/prova-${unit}`;
		const id = `teste-prova-ui-${randomUUID()}`,
			token = randomUUID(),
			attempt = randomUUID();
		let browser;
		try {
			await db.$transaction([
				db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste visual')`,
				db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},now()+interval '1 hour')`,
				db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",unit,questions) VALUES (${attempt},${id},${unit},${JSON.stringify(questions)}::jsonb)`,
			]);
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number BETWEEN ${(unit - 1) * 20 + 1} AND ${unit * 20}`;
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
			await browser.go(`${base}?tentativa=${attempt}`, `Prova ${unit}`);
			await until(
				() =>
					browser.evaluate(
						"document.querySelectorAll('input[type=radio]').length===4",
					),
				"quatro alternativas",
			);
			await browser.screenshot(`prova-${unit}-desktop`);
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
						`document.querySelector('input[name=question]')?.value==='u${unit}-2'`,
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
			await browser.screenshot(`prova-${unit}-celular`);
			await browser.go(
				`${base}?tentativa=${attempt}&questao=1`,
				`Prova ${unit}`,
			);
			await until(
				() =>
					browser.evaluate(
						"document.querySelector('input[type=radio]:checked')?.value==='0'",
					),
				"resposta retomada",
			);
			await browser.go(
				`${base}?tentativa=${attempt}&questao=20`,
				`Prova ${unit}`,
			);
			await until(
				() =>
					browser.evaluate(
						`document.querySelector('input[name=question]')?.value==='u${unit}-20'`,
					),
				"última questão",
			);
			assert.ok(
				await browser.evaluate(
					"document.documentElement.scrollWidth<=window.innerWidth",
				),
				"última questão cabe no celular",
			);
			await browser.screenshot(`prova-${unit}-ultima-celular`);
			const answers = Object.fromEntries(
				questions.map((q) => [q.id, q.answer]),
			);
			await db.$executeRaw`UPDATE "MeExamAttempt" SET answers=${JSON.stringify(answers)}::jsonb,"submittedAt"=now(),score=20 WHERE id=${attempt}`;
			await browser.go(`${base}?tentativa=${attempt}`, "Resultado");
			await browser.evaluate(
				"document.querySelector('main details summary').click()",
			);
			await until(
				() =>
					browser.evaluate(
						"document.body.innerText.includes('Resposta correta')",
					),
				"correção disponível",
			);
			assert.ok(
				await browser.evaluate(
					"document.documentElement.scrollWidth<=window.innerWidth",
				),
			);
			await browser.screenshot(`prova-${unit}-resultado`);
		} finally {
			await browser?.close();
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
			await db.$disconnect();
		}
	});
