import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3318")
	.origin;
assert.ok(
	["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname),
);
const db = new PrismaClient();
const path = "/aprender/elementar/1";

test("microinterações reais, falhas, revisão, XP e navegação no Chrome", async () => {
	const id = `teste-feedback-${randomUUID()}`;
	const token = randomUUID();
	let browser;
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Estudante de teste')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`,
		]);
		const [point] =
			await db.$queryRaw`SELECT id,"xpReward" AS reward FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=1`;
		const entries =
			await db.$queryRaw`SELECT a.id::text || '-' || e.number::text AS key,e.type,e.answer,e.payload FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId" WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const graded = entries.filter(({ answer }) => answer !== null);
		const [wrongEntry, correctEntry, secondWrong] = graded.filter(
			({ type }) => type === "MULTIPLE_CHOICE",
		);
		assert.ok(wrongEntry && correctEntry && secondWrong);
		browser = await openBrowser();
		const { send, evaluate, go, screenshot } = browser;
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 1000,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await go(origin + path, "Da lista ao conjunto");
		const hydrated = `Object.keys(document.querySelector('form[action$=responder]')??{}).some(k=>k.startsWith('__reactProps'))`;
		const formReady = () =>
			until(() => evaluate(hydrated), "formulário hidratado");
		const key = () =>
			evaluate(`document.querySelector('input[name=item]')?.value`);
		const submit = () =>
			evaluate(
				`document.querySelector('form[action$=responder] button[type=submit]').click()`,
			);
		await formReady();
		let mode = "slow";
		let requests = 0;
		browser.on("Fetch.requestPaused", async (event) => {
			try {
				if (event.request.method === "POST") {
					requests++;
					if (mode === "fail") {
						await send("Fetch.failRequest", {
							requestId: event.requestId,
							errorReason: "Failed",
						});
						return;
					}
					if (mode === "slow") await delay(1400);
				}
				await send("Fetch.continueRequest", { requestId: event.requestId });
			} catch {}
		});
		await send("Fetch.enable", {
			patterns: [{ urlPattern: "*responder", requestStage: "Request" }],
		});
		const buttonWidth = await evaluate(
			`document.querySelector('form[action$=responder] button[type=submit]').getBoundingClientRect().width`,
		);
		await submit();
		await submit();
		await until(
			() =>
				evaluate(
					`document.querySelector('form[aria-busy=true] button[aria-busy=true]')!==null`,
				),
			"envio ocupado",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('form[action$=responder] button[type=submit]').disabled`,
			),
			true,
		);
		assert.equal(
			await evaluate(
				`document.querySelector('form[action$=responder] button[type=submit]').getBoundingClientRect().width`,
			),
			buttonWidth,
		);
		await screenshot("envio-desktop");
		await until(
			async () => (await key()) === wrongEntry.key,
			"primeira questão",
		);
		assert.equal(requests, 1);
		await formReady();
		const wrong = wrongEntry.payload.alternativas.find(
			({ id }) => id !== wrongEntry.answer,
		).id;
		await evaluate(
			`document.querySelector('input[type=radio][value=${wrong}]').click()`,
		);
		mode = "fail";
		await submit();
		await until(
			() =>
				evaluate(
					`document.querySelector('form[data-question-state=error]')!==null`,
				),
			"erro técnico recuperável",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('input[type=radio]:checked').value`,
			),
			wrong,
		);
		assert.equal(
			await evaluate(
				`document.querySelector('form[action$=responder] button[type=submit]').disabled`,
			),
			false,
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.feedback-toast[data-kind=error]')!==null`,
			),
			true,
		);
		await screenshot("erro-rede-desktop");
		mode = "normal";
		await submit();
		await until(
			() =>
				evaluate(
					`document.querySelector('[data-outcome=error]')?.dataset.animate==='true'`,
				),
			"feedback coral confirmado",
		);
		assert.equal(
			await evaluate(
				`document.querySelectorAll('main input[type=radio]').length`,
			),
			0,
		);
		assert.match(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-outcome=error]')).animationName`,
			),
			/feedback-shake/,
		);
		await screenshot("erro-mobile-base");
		await send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		assert.equal(
			await evaluate("document.documentElement.scrollWidth<=innerWidth"),
			true,
		);
		await screenshot("erro-mobile");
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "reduce" }],
		});
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-outcome=error]')).animationName`,
			),
			"none",
		);
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		const continueLink = () =>
			evaluate(
				`[...document.querySelectorAll('main a')].find(e=>e.textContent.includes('Continuar')).click()`,
			);
		await until(
			() =>
				evaluate(
					`Object.keys([...document.querySelectorAll('main a')].find(e=>e.textContent.includes('Continuar'))??{}).some(k=>k.startsWith('__reactProps'))`,
				),
			"continuar hidratado",
		);
		await continueLink();
		await until(
			async () => (await key()) === correctEntry.key,
			"avanço após erro",
		);
		await formReady();
		await evaluate(
			`document.querySelector('input[type=radio][value=${correctEntry.answer}]').focus()`,
		);
		await send("Input.dispatchKeyEvent", {
			type: "keyDown",
			key: " ",
			code: "Space",
			windowsVirtualKeyCode: 32,
		});
		await send("Input.dispatchKeyEvent", {
			type: "keyUp",
			key: " ",
			code: "Space",
			windowsVirtualKeyCode: 32,
		});
		assert.equal(
			await evaluate(
				`document.querySelector('input[type=radio]:checked')?.value`,
			),
			correctEntry.answer,
		);
		await submit();
		await until(
			() =>
				evaluate(
					`document.querySelector('[data-outcome=success]')?.dataset.animate==='true'`,
				),
			"feedback menta confirmado",
		);
		assert.match(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-outcome=success] li')).animationName`,
			),
			/answer-correct/,
		);
		await screenshot("acerto-mobile");
		await until(
			() => evaluate(`document.querySelector('.feedback-toast')===null`),
			"notificação temporária encerrada",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('[data-outcome=success] h2')?.textContent.includes('Mandou bem')`,
			),
			true,
		);
		await send("Fetch.disable");
		const cookie = `authjs.session-token=${token}`;
		async function answer(entry, round, choice = entry.answer) {
			const form = new FormData();
			form.set("item", entry.key);
			form.set("rodada", String(round));
			if (entry.type === "WALKTHROUGH") form.set("resposta", "concluido");
			else if (typeof choice === "string") form.set("resposta", choice);
			else
				for (const pair of choice ?? [])
					form.set(`resposta:${pair.origem}`, pair.destino);
			const response = await fetch(`${origin}${path}/responder`, {
				method: "POST",
				body: form,
				headers: { cookie, origin },
			});
			const result = await response.json();
			assert.equal(response.status, 200, result.error);
			return result;
		}
		const start = entries.indexOf(correctEntry) + 1;
		for (const entry of entries.slice(start))
			await answer(
				entry,
				1,
				entry === secondWrong
					? entry.payload.alternativas.find(({ id }) => id !== entry.answer).id
					: entry.answer,
			);
		await go(origin + path, "Hora de revisar!");
		assert.equal(await key(), wrongEntry.key);
		await answer(wrongEntry, 2);
		const last = await answer(
			secondWrong,
			2,
			secondWrong.payload.alternativas.find(
				({ id }) => id !== secondWrong.answer,
			).id,
		);
		await go(origin + last.destination, "Vamos entender a resposta");
		assert.equal(
			await evaluate(
				`document.querySelector('form[action$=responder]')===null`,
			),
			true,
		);
		await go(origin + path, "Etapa concluída!");
		await until(
			() => evaluate(`document.querySelector('[data-celebrate=true]')!==null`),
			"celebração confirmada",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('[data-reward-count]').dataset.rewardCount`,
			),
			String(point.reward),
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.feedback-toast[data-kind=success]')!==null`,
			),
			true,
		);
		await until(
			() =>
				evaluate(
					`document.querySelector('[data-reward-count]')?.textContent === '+${point.reward}'`,
				),
			"contagem final de XP",
		);
		await screenshot("resultado-mobile");
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 1000,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await screenshot("resultado-desktop");
		await send("Page.reload");
		await until(
			() =>
				evaluate(
					`document.querySelector('#lesson-result')?.getClientRects().length`,
				),
			"resultado recarregado",
		);
		assert.equal(
			await evaluate(`document.querySelector('[data-celebrate=true]')!==null`),
			false,
		);
		await go(`${origin}/aprender`, "Trilhas de matemática");
		await until(
			() =>
				evaluate(
					`document.querySelector('#etapa-2[data-unlocked=true]')!==null`,
				),
			"nó desbloqueado",
		);
		assert.equal(
			await evaluate(`document.querySelector('#etapa-2 button').dataset.state`),
			"current",
		);
		await screenshot("desbloqueio-desktop");
		browser.on("Fetch.requestPaused", async (event) => {
			try {
				await delay(1200);
				await send("Fetch.continueRequest", { requestId: event.requestId });
			} catch {}
		});
		await send("Fetch.enable", {
			patterns: [{ urlPattern: "*ranking*", requestStage: "Request" }],
		});
		await until(
			() =>
				evaluate(
					`Object.keys(document.querySelector('a[href="/ranking"]')??{}).some(k=>k.startsWith('__reactProps'))`,
				),
			"link de navegação hidratado",
		);
		await evaluate(`document.querySelector('a[href="/ranking"]').focus()`);
		await send("Input.dispatchKeyEvent", {
			type: "keyDown",
			key: "Enter",
			code: "Enter",
			windowsVirtualKeyCode: 13,
		});
		await send("Input.dispatchKeyEvent", {
			type: "keyUp",
			key: "Enter",
			code: "Enter",
			windowsVirtualKeyCode: 13,
		});
		await until(
			() => evaluate(`document.querySelector('.feedback-navigation')!==null`),
			"navegação em processamento",
		);
		await screenshot("navegacao-desktop");
		await until(
			() =>
				evaluate(
					`location.pathname==='/ranking' && document.querySelector('main h1')?.getClientRects().length`,
				),
			"destino da navegação",
		);
		await until(
			() => evaluate(`document.querySelector('.feedback-navigation')===null`),
			"fim do carregamento da navegação",
		);
		await send("Fetch.disable");
		const [saved] =
			await db.$queryRaw`SELECT xp,"correctAnswers",attempts FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.equal(saved.xp, point.reward);
		assert.equal(saved.correctAnswers, graded.length - 1);
		assert.equal(saved.attempts[wrongEntry.key].length, 2);
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
