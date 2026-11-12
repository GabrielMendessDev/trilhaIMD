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

test("microinterações reais, falhas, revisão, XP e navegação no Chrome", {
	timeout: 180000,
}, async () => {
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
		await send("Emulation.setFocusEmulationEnabled", { enabled: true });
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
		assert.deepEqual(
			await evaluate(
				`(()=>{const motion=getComputedStyle(document.querySelector('.bito-rest'));return [motion.animationName,motion.animationIterationCount]})()`,
			),
			["bito-breathe", "2"],
		);
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
		await screenshot("questao-desktop");
		const wrong = wrongEntry.payload.alternativas.find(
			({ id }) => id !== wrongEntry.answer,
		).id;
		assert.equal(
			await evaluate(
				`document.querySelector('form[action$=responder] button[type=submit]')===null`,
			),
			true,
		);
		mode = "fail";
		await evaluate(
			`document.querySelector('input[type=radio][value=${wrong}]').click()`,
		);
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
				`document.querySelector('input[type=radio]:checked').matches(':disabled')`,
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
		mode = "slow";
		await evaluate(
			`window.originalChoice=document.querySelector('input[type=radio]:checked');window.motionEvents=[];document.addEventListener('animationstart',e=>window.motionEvents.push(e.animationName))`,
		);
		const retryRequests = requests;
		await evaluate(
			`document.querySelector('input[type=radio]:checked').click();document.querySelector('input[type=radio]:checked').click()`,
		);
		assert.equal(
			await evaluate(`document.querySelector('[data-outcome]')===null`),
			true,
		);
		mode = "normal";
		await until(
			() =>
				evaluate(
					`document.querySelector('[data-outcome=error]')?.dataset.animate==='true'`,
				),
			"feedback coral confirmado",
		);
		assert.equal(
			await evaluate(
				`[...document.querySelectorAll('main input[type=radio]')].every(e=>e.matches(':disabled')) && window.originalChoice===document.querySelector('input[type=radio]:checked')`,
			),
			true,
		);
		assert.match(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-outcome=error] .animated-choice:has(input:checked)')).animationName`,
			),
			/answer-reconsider/,
		);
		assert.equal(requests, retryRequests + 1);
		await screenshot("erro-desktop");
		assert.equal(
			await evaluate(`document.querySelector('.answer-solution')===null`),
			true,
		);
		assert.equal(
			await evaluate(`document.querySelector('.answer-reveal')!==null`),
			true,
		);
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
		try {
			await until(
				async () => (await key()) === correctEntry.key,
				"avanço após erro",
			);
		} catch (error) {
			console.error(
				await evaluate(
					`({url:location.href,key:document.querySelector('input[name=item]')?.value,headings:[...document.querySelectorAll('main h2')].map(e=>e.textContent),links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.href})),notices:[...document.querySelectorAll('[role=status]')].map(e=>e.textContent)})`,
				),
			);
			throw error;
		}
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
		await until(
			() =>
				evaluate(
					`document.querySelector('[data-outcome=success]')?.dataset.animate==='true'`,
				),
			"feedback menta confirmado",
		);
		assert.match(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-outcome=success] .animated-choice:has(input:checked)')).animationName`,
			),
			/answer-confirm/,
		);
		await screenshot("acerto-mobile");
		await screenshot("acerto-mobile-continuar", {
			viewport: true,
			bottom: true,
		});
		assert.equal(
			await evaluate(
				`window.motionEvents.some(n=>n.includes('mark-draw')) && window.motionEvents.some(n=>n.includes('panel-reveal'))`,
			),
			true,
		);
		assert.equal(
			await evaluate(
				`document.activeElement===document.querySelector('.answer-verdict h2')`,
			),
			true,
		);
		try {
			await until(
				() => evaluate(`document.querySelector('.feedback-toast')===null`),
				"notificação temporária encerrada",
			);
		} catch (error) {
			console.error(
				await evaluate(
					`({url:location.href,toasts:[...document.querySelectorAll('.feedback-toast')].map(e=>e.textContent)})`,
				),
			);
			throw error;
		}
		assert.equal(
			await evaluate(
				`document.querySelector('[data-outcome=success] .answer-verdict h2')?.textContent.includes('Mandou bem')`,
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
		const studyIndex = entries.findIndex(
			(entry, index) =>
				index > start && entry.answer === null && entry.type !== "WALKTHROUGH",
		);
		assert.ok(studyIndex > start);
		for (const entry of entries.slice(start, studyIndex - 1))
			await answer(
				entry,
				1,
				entry === secondWrong
					? entry.payload.alternativas.find(({ id }) => id !== entry.answer).id
					: entry.answer,
			);
		const beforeStudy = entries[studyIndex - 1];
		assert.equal(beforeStudy.type, "MULTIPLE_CHOICE");
		await go(origin + path, "O inventário das tags");
		await until(
			async () => (await key()) === beforeStudy.key,
			"questão antes da explicação",
		);
		await formReady();
		await evaluate(
			`document.querySelector('input[type=radio][value=${beforeStudy.answer}]').click()`,
		);
		await until(
			() => evaluate(`document.querySelector('.answer-continue')!==null`),
			"confirmação antes da explicação",
		);
		await continueLink();
		await until(
			async () => (await key()) === entries[studyIndex].key,
			"questão para explicação",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.lesson-transition').dataset.stepKind`,
			),
			"explanation",
		);
		assert.equal(
			await evaluate(`document.querySelector('.learning-diagram')!==null`),
			true,
		);
		await until(
			() =>
				evaluate(
					`document.querySelector('.lesson-transition').getAnimations().some(a=>a.animationName==='explanation-enter')`,
				),
			"entrada da explicação executada sem bloquear navegação",
		);
		await formReady();
		await submit();
		await until(
			async () => (await key()) === entries[studyIndex + 1].key,
			"explicação para exercício",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.lesson-transition').dataset.stepKind`,
			),
			"question",
		);
		const association = entries[studyIndex + 1];
		assert.equal(association.type, "ASSOCIATION");
		await formReady();
		for (const [index, pair] of association.answer.entries()) {
			await evaluate(
				`(()=>{const field=document.querySelector('select[name="resposta:${pair.origem}"]');field.value=${JSON.stringify(pair.destino)};field.dispatchEvent(new Event('change',{bubbles:true}));})()`,
			);
			if (index < association.answer.length - 1)
				assert.equal(
					await evaluate(`document.querySelector('[data-outcome]')===null`),
					true,
				);
		}
		await until(
			() => evaluate(`document.querySelector('[data-outcome=success]')!==null`),
			"associação envia só ao completar",
		);
		await continueLink();
		const links = entries[studyIndex + 2];
		assert.equal(links.type, "PAIR_LINKS");
		try {
			await until(async () => (await key()) === links.key, "ligar pares");
		} catch (error) {
			console.error(
				await evaluate(
					`({url:location.href,key:document.querySelector('input[name=item]')?.value,links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.href,busy:e.getAttribute('aria-busy')})),nativeMotion:window.nativeMotion,animations:document.getAnimations().map(a=>({name:a.animationName,state:a.playState})),toasts:[...document.querySelectorAll('.feedback-toast')].map(e=>e.textContent)})`,
				),
			);
			throw error;
		}
		await formReady();
		for (const [index, pair] of links.answer.entries()) {
			await evaluate(
				`document.querySelector('[data-pair-source="${pair.origem}"]').click()`,
			);
			await until(
				() =>
					evaluate(
						`!document.querySelector('[data-pair-target="${pair.destino}"]').disabled`,
					),
				"destino habilitado",
			);
			await evaluate(
				`document.querySelector('[data-pair-target="${pair.destino}"]').click()`,
			);
			if (index < links.answer.length - 1)
				assert.equal(
					await evaluate(`document.querySelector('[data-outcome]')===null`),
					true,
				);
		}
		await until(
			() => evaluate(`document.querySelector('[data-outcome=success]')!==null`),
			"pares enviam só ao completar",
		);
		for (const entry of entries.slice(studyIndex + 3))
			await answer(
				entry,
				1,
				entry === secondWrong
					? entry.payload.alternativas.find(({ id }) => id !== entry.answer).id
					: entry.answer,
			);
		await go(origin + path, "Hora de revisar!");
		assert.equal(await key(), wrongEntry.key);
		assert.equal(
			await evaluate(
				`document.querySelector('.lesson-transition').dataset.stepKind`,
			),
			"review",
		);
		await formReady();
		await evaluate(
			`document.querySelector('input[type=radio][value=${wrongEntry.answer}]').click()`,
		);
		await until(
			() =>
				evaluate(
					`document.querySelector('.answer-verdict h2')?.textContent.includes('Você conseguiu na revisão')`,
				),
			"recuperação na segunda tentativa",
		);
		await continueLink();
		await until(
			async () => (await key()) === secondWrong.key,
			"segunda questão da revisão",
		);
		await formReady();
		const missedChoice = secondWrong.payload.alternativas.find(
			({ id }) => id !== secondWrong.answer,
		).id;
		await evaluate(
			`document.querySelector('input[type=radio][value=${missedChoice}]').click()`,
		);
		await until(
			() =>
				evaluate(
					`document.querySelector('.answer-verdict h2')?.textContent.includes('Vamos entender a resposta')`,
				),
			"dificuldade na segunda tentativa",
		);
		assert.equal(
			await evaluate(`document.querySelector('.answer-solution')!==null`),
			true,
		);
		await screenshot("revisao-mobile");
		await send("Page.reload");
		await until(
			() => evaluate(`document.querySelector('.answer-solution')!==null`),
			"feedback restaurado",
		);
		assert.equal(
			await evaluate(`document.querySelector('[data-animate=true]')===null`),
			true,
		);
		assert.equal(
			await evaluate(
				`document.querySelector('input[type=radio]:checked')?.value`,
			),
			missedChoice,
		);
		await evaluate(`document.querySelector('.answer-continue').click()`);
		await until(
			() => evaluate(`document.querySelector('#lesson-result')!==null`),
			"conclusão pela navegação real",
		);
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
				`document.querySelector('.completion-next')?.textContent.includes('Etapa 2')`,
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
		await screenshot("resultado-mobile-acoes", {
			viewport: true,
			bottom: true,
		});
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
		assert.equal(
			await evaluate(
				`document.querySelector('.completion-effects a.ui-button').textContent.includes('Voltar ao mapa')`,
			),
			true,
		);
		assert.equal(
			await evaluate(
				`[...document.querySelectorAll('.completion-effects a')].some(a=>a.pathname==='/aprender/elementar/2')`,
			),
			false,
		);
		await until(
			() =>
				evaluate(
					`Object.keys(document.querySelector('.completion-effects a.ui-button')??{}).some(k=>k.startsWith('__reactProps'))`,
				),
			"retorno ao mapa hidratado",
		);
		await evaluate(
			`document.querySelector('.completion-effects a.ui-button').click()`,
		);
		await until(
			() =>
				evaluate(
					`location.pathname==='/aprender' && document.querySelector('main h1')?.textContent.includes('Suas trilhas')`,
				),
			"conclusão retorna ao mapa",
		);
		assert.equal(
			await evaluate(`new URLSearchParams(location.search).get('etapa')`),
			"2",
		);
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
		const energy = await evaluate(
			`(()=>{const segment=document.querySelector('[data-trail-segment="1"][data-energize]');const motion=segment.getAnimations()[0];if(!motion)return null;motion.pause();segment.style.setProperty('--accent','rgb(22, 127, 188)');motion.currentTime=300;const active=getComputedStyle(segment).stroke;motion.finish();const completed=getComputedStyle(segment).stroke;segment.style.removeProperty('--accent');return {active,completed};})()`,
		);
		assert.deepEqual(energy, {
			active: "rgb(22, 127, 188)",
			completed: "rgb(37, 197, 171)",
		});
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "reduce" }],
		});
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('[data-trail-segment="1"]')).stroke`,
			),
			"rgb(37, 197, 171)",
		);
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await screenshot("desbloqueio-desktop");
		browser.on("Fetch.requestPaused", async (event) => {
			try {
				await delay(1200);
				await send("Fetch.continueRequest", { requestId: event.requestId });
			} catch {}
		});
		await send("Fetch.enable", {
			patterns: [{ urlPattern: "*progresso*", requestStage: "Request" }],
		});
		await until(
			() =>
				evaluate(
					`Object.keys(document.querySelector('a[href="/progresso"]')??{}).some(k=>k.startsWith('__reactProps'))`,
				),
			"link de navegação hidratado",
		);
		await evaluate(
			`window.routeArrivals=[];const originalAnimate=Element.prototype.animate;Element.prototype.animate=function(...args){const motion=originalAnimate.apply(this,args);queueMicrotask(()=>{if(motion.id==='route-arrival')window.routeArrivals.push({frames:motion.effect.getKeyframes(),duration:motion.effect.getTiming().duration});});return motion;};document.querySelector('a[href="/progresso"]').focus()`,
		);
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
			() =>
				evaluate(
					`document.querySelector('a[href="/progresso"]')?.getAttribute('aria-busy')==='true' || document.querySelector('[aria-label="Carregando conteúdo"]')!==null`,
				),
			"navegação em processamento no próprio link",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.feedback-navigation')===null && document.querySelector('.feedback-viewport')===null`,
			),
			true,
		);
		await screenshot("navegacao-desktop");
		await until(
			() =>
				evaluate(
					`location.pathname==='/progresso' && document.querySelector('main h1')?.getClientRects().length`,
				),
			"destino da navegação",
		);
		await until(
			() => evaluate(`document.querySelector('.feedback-navigation')===null`),
			"fim do carregamento da navegação",
		);
		await until(
			() =>
				evaluate(
					`window.routeArrivals.some(motion=>motion.duration===340 && Number(motion.frames[0].opacity)===.2 && Number(motion.frames.at(-1).opacity)===1)`,
				),
			"fade de rota executado pelo navegador",
		);
		await send("Fetch.disable");
		const [saved] =
			await db.$queryRaw`SELECT xp,"correctAnswers",attempts FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.equal(saved.xp, point.reward);
		assert.equal(saved.correctAnswers, graded.length - 1);
		assert.equal(saved.attempts[wrongEntry.key].length, 2);
	} catch (error) {
		if (browser)
			console.error(
				await browser.evaluate(
					`({url:location.href,key:document.querySelector('input[name=item]')?.value,nativeMotion:window.nativeMotion,links:[...document.querySelectorAll('main a')].map(e=>({text:e.textContent,href:e.href,busy:e.getAttribute('aria-busy')})),animations:document.getAnimations().map(a=>({name:a.animationName,state:a.playState})),toasts:[...document.querySelectorAll('.feedback-toast')].map(e=>e.textContent)})`,
				),
			);
		throw error;
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
