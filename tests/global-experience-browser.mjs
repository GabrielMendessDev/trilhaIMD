import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3318")
	.origin;
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
test("jornada global, missões reais, disciplinas, lição focada e responsividade", {
	timeout: 600000,
}, async () => {
	const id = `teste-global-${randomUUID()}`,
		token = randomUUID(),
		cookie = `authjs.session-token=${token}`;
	let browser;
	const evidence = [];
	const fixes = [];
	async function answer(entry, number, round = 1, value = entry.answer) {
		const form = new FormData();
		form.set("item", entry.key);
		form.set("rodada", String(round));
		if (entry.type === "WALKTHROUGH") form.set("resposta", "concluido");
		else if (typeof value === "string") form.set("resposta", value);
		else
			for (const pair of value ?? [])
				form.set(`resposta:${pair.origem}`, pair.destino);
		const response = await fetch(
			`${origin}/aprender/elementar/${number}/responder`,
			{ method: "POST", headers: { cookie, origin }, body: form },
		);
		const result = await response.json();
		assert.equal(response.status, 200, JSON.stringify(result));
		return result;
	}
	try {
		await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Lia Exploradora de teste')`;
		await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		const points =
			await db.$queryRaw`SELECT p.id,p.number,p."xpReward" AS reward,(SELECT title FROM "LearningActivity" a WHERE a."pointId"=p.id ORDER BY id LIMIT 1) AS title FROM "TrailPoint" p WHERE "trailSlug"='elementar' ORDER BY number`;
		const entries = async (pointId) =>
			db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer,e.payload FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId" WHERE a."pointId"=${pointId} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const firstRows = await entries(points[0].id);
		// Persisted completion fixture; the real import engine grants its rewards once.
		// HTTP regression suites cover every response of this first lesson separately.
		const priorAttempts = Object.fromEntries(
			firstRows
				.filter((e) => e.answer !== null && e.type !== "WALKTHROUGH")
				.map((e) => [
					e.key,
					[
						{
							correct: true,
							selection:
								typeof e.answer === "string"
									? [e.answer]
									: e.answer.map((p) => p.destino),
						},
					],
				]),
		);
		await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedEntries",attempts,"completedAt",xp,"correctAnswers") VALUES (${id},${points[0].id},${firstRows.map((e) => e.key)}::text[],${JSON.stringify(priorAttempts)}::jsonb,now(),${points[0].reward},${Object.keys(priorAttempts).length})`;
		const state = await (
			await fetch(`${origin}/api/rpg`, { headers: { cookie } })
		).json();
		assert.ok(state.bits >= 35);
		assert.equal(state.stats.lessons, 1);
		const purchase = await fetch(`${origin}/api/rpg`, {
			method: "POST",
			headers: { cookie, origin, "Content-Type": "application/json" },
			body: JSON.stringify({
				action: "buy",
				itemId: "hint-scroll",
				requestId: randomUUID(),
			}),
		});
		assert.equal(purchase.status, 200);
		const [checkCompletion] =
			await db.$queryRaw`SELECT xp FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${points[0].id}`;
		assert.ok(checkCompletion.xp > 0);
		browser = await openBrowser();
		const { send, evaluate, go, screenshot } = browser;
		await send("Emulation.setFocusEmulationEnabled", { enabled: true });
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		const size = async (width, height = 1000) =>
			send("Emulation.setDeviceMetricsOverride", {
				width,
				height,
				deviceScaleFactor: 1,
				mobile: width < 768,
			});
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		const capture = async (name, options = { viewport: true }) =>
			screenshot(`global-${name}`, options);
		async function checkHome() {
			const result = await evaluate(`(() => {
				const a=getComputedStyle(document.querySelector('.journey-node-detail a'));
				const luminance=c=>c.match(/[\\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0);
				const x=luminance(a.color),y=luminance(a.backgroundColor);
				const image=document.querySelector('.bito-outpost>img').getBoundingClientRect();
				const overlapping=[...document.querySelectorAll('.bito-outpost h2,.bito-outpost>p,.bito-outpost a')].some(e=>{const r=e.getBoundingClientRect();return r.left<image.right&&r.right>image.left&&r.top<image.bottom&&r.bottom>image.top});
				return {width:innerWidth,theme:document.documentElement.dataset.theme,contrast:(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05),overlapping,background:getComputedStyle(document.querySelector('.app-workspace')).background};
			})()`);
			fixes.push(result);
			assert.ok(result.contrast >= 4.5, JSON.stringify(result));
			assert.equal(result.overlapping, false, JSON.stringify(result));
		}
		const routes = [
			["home", "/", "Olá, Lia"],
			["trails", "/aprender", "Suas trilhas"],
			["disciplines", "/disciplinas", "O que vamos aprender"],
			["course", "/disciplinas/elementar", "Matemática Elementar"],
			["progress", "/progresso", "Veja o quanto"],
			["achievements", "/conquistas", "Conquistas"],
			["shop", "/loja", "Loja do Bito"],
			["inventory", "/mochila", "Sua Mochila"],
			["profile", "/perfil", "Seu perfil de explorador"],
			["missions", "/missoes", "Pequenas metas"],
			["league", "/ranking", "Ranking"],
		];
		for (const [name, path, heading] of routes) {
			await size(1440);
			await go(origin + path, heading);
			await capture(`${name}-desktop`);
			if (name === "home") {
				await checkHome();
				assert.equal(
					await evaluate(
						`document.querySelectorAll('.journey-main [data-trail-node]').length`,
					),
					10,
				);
				assert.ok(
					await evaluate(
						`document.querySelector('.daily-missions').textContent.includes('recebido')`,
					),
				);
			}
			if (name === "inventory")
				assert.ok(
					await evaluate(
						`document.querySelector('.inventory-slot button')!==null`,
					),
				);
			for (const width of [320, 390, 768, 1024, 1920]) {
				await size(width, width < 768 ? 844 : 1000);
				await evaluate(`document.fonts.ready.then(()=>true)`);
				const overflow = await evaluate(
					`document.documentElement.scrollWidth-innerWidth`,
				);
				evidence.push({ route: path, width, overflow });
				assert.ok(
					overflow <= 1,
					`${name} transborda ${overflow}px em ${width}px`,
				);
				if (width === 390) await capture(`${name}-mobile`);
				if (name === "home" && [1024, 1920].includes(width)) await checkHome();
				if (name === "profile") {
					assert.ok(
						await evaluate(
							`document.querySelector('.profile-level .study-progress').getBoundingClientRect().height>=8`,
						),
					);
				}
			}
		}
		await size(1440);
		await go(`${origin}/aprender/elementar/1`, points[0].title);
		await until(
			() => evaluate(`document.querySelector('.lesson-completion')!==null`),
			"conclusão salva",
		);
		assert.equal(
			await evaluate(
				`document.querySelector('.app-workspace').getBoundingClientRect().left`,
			),
			0,
		);
		assert.notEqual(
			await evaluate(
				`getComputedStyle(document.querySelector('.app-top')).backgroundColor`,
			),
			"rgba(0, 0, 0, 0)",
		);
		assert.equal(
			await evaluate(`document.querySelector('.completion-bits').textContent`),
			"+25",
		);
		await capture("completion-desktop");
		await size(390, 844);
		await capture("completion-mobile");
		const secondRows = await entries(points[1].id),
			firstQuestion = secondRows.find((e) => e.type === "MULTIPLE_CHOICE");
		for (const e of secondRows) {
			if (e.key === firstQuestion.key) break;
			await answer(e, 2);
		}
		await size(1440);
		await go(`${origin}/aprender/elementar/2`, points[1].title);
		await until(
			() => evaluate(`document.querySelector('form[data-auto-submit]')!==null`),
			"questão focada",
		);
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('.app-rail')).display`,
			),
			"none",
		);
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('.app-bottom-nav')).display`,
			),
			"none",
		);
		await capture("question-desktop");
		await size(390, 844);
		await capture("question-mobile");
		const wrong = firstQuestion.payload.alternativas.find(
			(a) => a.id !== firstQuestion.answer,
		).id;
		await evaluate(
			`document.querySelector('input[name=resposta][value=${JSON.stringify(wrong)}]').click()`,
		);
		await until(
			() => evaluate(`document.querySelector('[data-outcome=error]')!==null`),
			"erro confirmado",
		);
		assert.ok(
			await evaluate(
				`document.querySelector('.answer-result').textContent.includes('revisão final')`,
			),
		);
		assert.equal(
			await evaluate(`document.querySelector('.answer-solution')`),
			null,
		);
		await capture("wrong-mobile", { viewport: true, bottom: true });
		await size(1440);
		await capture("wrong-desktop", { viewport: true, bottom: true });
		// Finish the initial round with genuine answers, then verify only the wrong item returns.
		for (const e of secondRows.slice(
			secondRows.findIndex((e) => e.key === firstQuestion.key) + 1,
		))
			await answer(e, 2);
		await go(`${origin}/aprender/elementar/2`, points[1].title);
		await until(
			() =>
				evaluate(`document.querySelector('input[name=rodada]')?.value==='2'`),
			"revisão de segunda rodada",
		);
		await capture("review-desktop");
		await size(390, 844);
		await capture("review-mobile");
		await evaluate(
			`document.querySelector('input[name=resposta][value=${JSON.stringify(firstQuestion.answer)}]').click()`,
		);
		await until(
			() => evaluate(`document.querySelector('[data-outcome=success]')!==null`),
			"recuperada na revisão",
		);
		await capture("recovered-mobile", { viewport: true, bottom: true });
		await size(1440);
		await go(
			`${origin}/aprender/elementar/1?item=${firstRows[0].key}`,
			points[0].title,
		);
		await until(
			() => evaluate(`document.querySelector('.concept-explorer')!==null`),
			"explicação interativa",
		);
		await capture("explanation-desktop");
		await size(390, 844);
		await capture("explanation-mobile");
		await evaluate(
			`document.querySelectorAll('.concept-tag-picker button')[3].click()`,
		);
		assert.ok(
			await evaluate(
				`document.querySelector('.concept-explorer figcaption').textContent.includes('jogos ∉ A')`,
			),
		);
		await evaluate(
			`document.querySelectorAll('.concept-explorer-controls button')[1].click()`,
		);
		assert.ok(
			await evaluate(
				`document.querySelector('.concept-explorer figcaption').textContent.includes('B ⊆ A')`,
			),
		);
		await go(`${origin}/perfil`, "Seu perfil de explorador");
		await evaluate(`document.documentElement.dataset.theme='light'`);
		await capture("profile-light-mobile");
		await size(1440);
		await go(`${origin}/`, "Olá, Lia");
		await evaluate(`document.documentElement.dataset.theme='light'`);
		await capture("home-light-desktop");
		await checkHome();
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "reduce" }],
		});
		await go(
			`${origin}/aprender/elementar/1?item=${firstRows[0].key}`,
			points[0].title,
		);
		await until(
			() => evaluate(`document.querySelector('.concept-explorer')!==null`),
			"conteúdo em movimento reduzido",
		);
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('.learning-diagram')).animationName`,
			),
			"none",
		);
		await send("Network.deleteCookies", {
			name: "authjs.session-token",
			url: origin,
		});
		await size(1440);
		await go(`${origin}/login`, "Sua jornada começa aqui");
		await capture("login-desktop");
		await size(390, 844);
		await capture("login-mobile");
		await go(`${origin}/endereco-inexistente`, "Página fora da trilha");
		await capture("not-found-mobile");
		if (process.env.TRILBIT_SCREENSHOTS) {
			await mkdir(process.env.TRILBIT_SCREENSHOTS, { recursive: true });
			await writeFile(
				`${process.env.TRILBIT_SCREENSHOTS}/global-layout-checks.json`,
				JSON.stringify(evidence, null, 2),
			);
			await writeFile(
				`${process.env.TRILBIT_SCREENSHOTS}/global-fix-checks.json`,
				JSON.stringify(fixes, null, 2),
			);
		}
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
