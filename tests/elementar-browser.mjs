import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

const origin = process.env.TRILBIT_TEST_URL;
assert.ok(origin && new URL(origin).hostname === "127.0.0.1");
const db = new PrismaClient();
const students = [];
process.env.TRILBIT_SCREENSHOTS = resolve("tests/artifacts/elementar-60");
async function learner() {
	const id = `teste-browser-vidas-${randomUUID()}`,
		token = randomUUID();
	students.push(id);
	await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste visual')`;
	await db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
	const u = { id, token, cookie: `authjs.session-token=${token}` };
	await fetch(origin + "/api/rpg", { headers: { cookie: u.cookie } });
	return u;
}
async function answer(u, e, bad = false) {
	const form = new FormData();
	form.set("item", e.key);
	form.set("rodada", "1");
	if (e.type === "WALKTHROUGH") form.set("resposta", "concluido");
	else if (e.type)
		form.set(
			"resposta",
			bad ? e.payload.alternativas.find((a) => a.id !== e.answer).id : e.answer,
		);
	const r = await fetch(origin + "/aprender/elementar/1/responder", {
		method: "POST",
		headers: { cookie: u.cookie, origin },
		body: form,
	});
	assert.equal(r.status, 200, await r.clone().text());
	return r.json();
}
test("leitor completo, mapa contínuo, vidas, revisão e loja funcionam no desktop e celular", {
	timeout: 240000,
}, async () => {
	await mkdir(process.env.TRILBIT_SCREENSHOTS, { recursive: true });
	const browser = await openBrowser();
	const errors = [];
	browser.on("Runtime.exceptionThrown", (e) =>
		errors.push(e.exceptionDetails.text),
	);
	await browser.send("Runtime.enable");
	const size = async (width, height) =>
		browser.send("Emulation.setDeviceMetricsOverride", {
			width,
			height,
			deviceScaleFactor: 1,
			mobile: width < 600,
		});
	const noOverflow = async () =>
		assert.ok(
			await browser.evaluate(
				"document.documentElement.scrollWidth<=innerWidth+1",
			),
		);
	try {
		await size(1440, 1000);
		await browser.go(
			origin + "/materiais/elementar/index.html#passo-1",
			"Coleções",
		);
		await noOverflow();
		await browser.screenshot("reader-desktop");
		await browser.go(
			origin + "/materiais/elementar/index.html#passo-59-tela-3",
			"Qual condição",
		);
		await browser.evaluate(
			"document.querySelector('input[type=radio]').click();document.querySelector('form').requestSubmit()",
		);
		await until(
			() =>
				browser.evaluate("Boolean(document.querySelector('.feedback strong'))"),
			"feedback do leitor",
		);
		await browser.screenshot("reader-quiz-desktop");
		await browser.go(
			origin + "/materiais/elementar/index.html#passo-49-tela-4",
			"Por que isso funciona",
		);
		await until(
			() =>
				browser.evaluate(
					"[...document.images].every(i=>i.complete&&i.naturalWidth>0)",
				),
			"figura do ciclo",
		);
		await browser.screenshot("reader-diagram-desktop");
		await size(390, 844);
		await noOverflow();
		await browser.screenshot("reader-diagram-mobile");
		await browser.go(
			origin + "/materiais/elementar/index.html#passo-60-tela-17",
			"Qual é a inversa",
		);
		assert.match(
			await browser.evaluate("document.getElementById('position').textContent"),
			/Passo 60 de 60.*Tela 17 de 17/,
		);
		await noOverflow();
		await browser.screenshot("reader-quiz-mobile");
		await browser.go(origin + "/aprender", "Suas trilhas");
		await until(
			() =>
				browser.evaluate(
					"document.querySelectorAll('[data-trail-node]').length===60",
				),
			"sessenta nós no mesmo mapa",
		);
		assert.equal(
			await browser.evaluate(
				"document.querySelectorAll('.elementar-units').length",
			),
			0,
		);
		await noOverflow();
		await browser.screenshot("map-mobile");
		await browser.screenshot("map-mobile-top", { viewport: true });
		await size(1440, 1000);
		await browser.screenshot("map-desktop");
		await browser.screenshot("map-desktop-top", { viewport: true });
		const u = await learner();
		await browser.send("Network.setCookie", {
			name: "authjs.session-token",
			value: u.token,
			url: origin,
		});
		const [point] =
			await db.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=1`;
		const entries =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer,e.payload FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${point.id} ORDER BY COALESCE(e.position,e.number)`;
		let missed = false;
		for (const e of entries) {
			if (missed && e.type === "MULTIPLE_CHOICE") break;
			await answer(u, e, e.type === "MULTIPLE_CHOICE");
			if (e.type === "MULTIPLE_CHOICE") missed = true;
		}
		await db.$executeRaw`UPDATE "RpgWallet" SET bits=500 WHERE "userId"=${u.id}`;
		for (const itemId of ["life-drop", "life-potion", "life-elixir"]) {
			const r = await fetch(origin + "/api/rpg", {
				method: "POST",
				headers: {
					cookie: u.cookie,
					origin,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action: "buy",
					itemId,
					requestId: randomUUID(),
				}),
			});
			assert.equal(r.status, 200);
		}
		await browser.go(origin + "/aprender/elementar/1", "Coleções");
		await until(
			() =>
				browser.evaluate(
					"document.querySelector('[data-lives]')?.dataset.lives==='4'",
				),
			"quatro vidas persistidas",
		);
		await browser.screenshot("lives-desktop");
		await browser.evaluate("document.querySelector('.rpg-open-bag').click()");
		await until(
			() =>
				browser.evaluate(
					"document.querySelector('dialog[open]')?.textContent.includes('Gota de Vida')",
				),
			"três itens na mochila",
		);
		await browser.screenshot("bag-desktop");
		await browser.evaluate("document.querySelector('dialog[open]').close()");
		await size(390, 844);
		await noOverflow();
		await browser.screenshot("lives-mobile");
		await db.$executeRaw`UPDATE "LearningPointProgress" SET lives=1 WHERE "userId"=${u.id} AND "pointId"=${point.id}`;
		await browser.go(origin + "/aprender/elementar/1", "Coleções");
		await until(
			() =>
				browser.evaluate(
					"document.querySelector('[data-lives]')?.dataset.lives==='1'",
				),
			"última vida",
		);
		const current = entries.find(
			(e) => e.type === "MULTIPLE_CHOICE" && e.key.endsWith("-5"),
		);
		assert.ok(current);
		const bad = current.payload.alternativas.find(
			(a) => a.id !== current.answer,
		).id;
		await browser.evaluate(
			`document.querySelector('input[name=resposta][value=${JSON.stringify(bad)}]').click()`,
		);
		await until(
			() =>
				browser.evaluate(
					"document.body.textContent.includes('As vidas acabaram')",
				),
			"derrota após a última vida",
		);
		assert.equal(
			await browser.evaluate(
				"document.querySelector('[data-lives]').dataset.lives",
			),
			"0",
		);
		await browser.go(origin + "/aprender/elementar/1", "Atividade perdida");
		await noOverflow();
		await browser.screenshot("failed-mobile");
		await size(1440, 1000);
		await browser.screenshot("failed-desktop");
		await until(
			() =>
				browser.evaluate(
					"[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Recomeçar com 5 vidas')&&typeof b.onclick==='function')",
				),
			"recomeço hidratado",
		);
		await browser.evaluate(
			"[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Recomeçar com 5 vidas')).click()",
		);
		try {
			await until(
				() =>
					browser.evaluate(
						"document.querySelector('[data-lives]')?.dataset.lives==='5'&&!document.querySelector('#lesson-lost')",
					),
				"recomeço com cinco vidas",
			);
		} catch (error) {
			console.log(
				"Diagnóstico do recomeço",
				await browser.evaluate(
					"({text:document.body.innerText,errors:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent)})",
				),
				errors,
			);
			throw error;
		}
		const review = await learner();
		for (const e of entries)
			await answer(
				review,
				e,
				e === entries.find((e) => e.type === "MULTIPLE_CHOICE"),
			);
		await browser.send("Network.setCookie", {
			name: "authjs.session-token",
			value: review.token,
			url: origin,
		});
		await browser.go(origin + "/aprender/elementar/1", "Hora de revisar");
		assert.equal(
			await browser.evaluate(
				"document.querySelector('[data-lives]').dataset.lives",
			),
			"4",
		);
		await browser.screenshot("review-desktop");
		await size(390, 844);
		await noOverflow();
		await browser.screenshot("review-mobile");
		await browser.go(origin + "/loja", "Loja do Bito");
		await noOverflow();
		assert.ok(
			await browser.evaluate(
				"document.body.textContent.includes('Elixir de Fôlego')",
			),
		);
		await browser.screenshot("shop-mobile");
		await size(1440, 1000);
		await browser.screenshot("shop-desktop");
		assert.deepEqual(errors, []);
		console.log(
			"Capturas desktop/móvel e fluxos do mapa, leitor, vidas, perda, recomeço, revisão e loja conferidos.",
		);
	} finally {
		await browser.close();
		for (const id of students)
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
