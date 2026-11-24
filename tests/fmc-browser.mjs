import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { getExamDefinition } from "../src/server/me-exam-bank.mjs";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3337";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
for (const unit of [1, 2, 3])
	test(`FMC Prova ${unit} funciona em desktop/celular e movimento reduzido`, async () => {
		const db = new PrismaClient();
		const questions = getExamDefinition(unit, "fmc").questions;
		const base = `${origin}/aprender/fmc/prova-${unit}`;
		const id = `teste-fmc-prova-ui-${randomUUID()}`,
			token = randomUUID(),
			attempt = randomUUID();
		let browser;
		try {
			await db.$transaction([
				db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste visual')`,
				db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},now()+interval '1 hour')`,
				db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",unit,trail,questions) VALUES (${attempt},${id},${unit},'fmc',${JSON.stringify(questions)}::jsonb)`,
			]);
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='fmc' AND number BETWEEN ${(unit - 1) * 6 + 1} AND ${unit * 6}`;
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
			await browser.screenshot(`fmc-prova-${unit}-desktop`);
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
						`document.querySelector('input[name=question]')?.value==='fmc-u${unit}-2'`,
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
			await browser.screenshot(`fmc-prova-${unit}-celular`);
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
						`document.querySelector('input[name=question]')?.value==='fmc-u${unit}-20'`,
					),
				"última questão",
			);
			assert.ok(
				await browser.evaluate(
					"document.documentElement.scrollWidth<=window.innerWidth",
				),
				"última questão cabe no celular",
			);
			await browser.screenshot(`fmc-prova-${unit}-ultima-celular`);
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
			await browser.screenshot(`fmc-prova-${unit}-resultado`);
		} finally {
			await browser?.close();
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
			await db.$disconnect();
		}
	});

test("FMC: mapa com três unidades e leitor com exercícios no celular", async () => {
	const db = new PrismaClient();
	const id = `teste-fmc-mapa-${randomUUID()}`,
		token = randomUUID();
	let browser;
	try {
		await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste do mapa')`;
		await db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},now()+interval '1 hour')`;
		browser = await openBrowser();
		await browser.send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
			sameSite: "Lax",
		});
		await browser.send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		await browser.send("Page.navigate", {
			url: `${origin}/aprender?modulo=fmc`,
		});
		await until(
			() =>
				browser.evaluate(
					"document.querySelectorAll('.course-chapters > ol > li').length===3",
				),
			"três unidades de FMC",
		);
		assert.ok(
			await browser.evaluate(
				"document.querySelector('a[href=\"/aprender/fmc/plano\"]')!==null",
			),
		);
		await browser.screenshot("fmc-mapa-celular");
		await browser.go(`${origin}/aprender/fmc/1`, "Linguagem matemática");
		assert.ok(
			await browser.evaluate(
				"document.documentElement.scrollWidth<=window.innerWidth",
			),
		);
		await browser.screenshot("fmc-aula-celular");
		await browser.send("Page.navigate", {
			url: `${origin}/materiais/fmc/leitor.html`,
		});
		await until(
			() =>
				browser.evaluate(
					"document.querySelectorAll('main article').length===180",
				),
			"180 exercícios no leitor",
		);
		assert.equal(
			await browser.evaluate(
				"document.querySelectorAll('main section').length",
			),
			18,
		);
		assert.equal(
			await browser.evaluate(
				"document.querySelectorAll('main article > ol > li').length",
			),
			540,
		);
		assert.equal(
			await browser.evaluate(
				"document.querySelectorAll('article details[open]').length",
			),
			0,
		);
		assert.ok(
			await browser.evaluate(
				"document.documentElement.scrollWidth<=window.innerWidth",
			),
		);
		await browser.evaluate(
			"document.querySelector('#passo-18').scrollIntoView()",
		);
		await browser.screenshot("fmc-leitor-recorrencias-celular");
		await browser.evaluate(
			"document.querySelector('#passo-18 article summary').click()",
		);
		assert.ok(
			await browser.evaluate(
				"document.querySelector('#passo-18 article details').open",
			),
		);
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
