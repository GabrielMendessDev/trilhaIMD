import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const db = new PrismaClient();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3318")
	.origin;
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
test("loja, inventário, medalhas e mochila nas lições em desktop e celular", {
	timeout: 180000,
}, async () => {
	const id = `teste-rpg-browser-${randomUUID()}`,
		token = randomUUID();
	let browser;
	try {
		await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Exploradora de teste')`;
		await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		const cookie = `authjs.session-token=${token}`;
		await fetch(`${origin}/api/rpg`, { headers: { cookie } });
		await db.$executeRaw`UPDATE "RpgWallet" SET bits=500 WHERE "userId"=${id}`;
		await db.$executeRaw`INSERT INTO "CurrencyTransaction"("userId",key,kind,subject,bits,xp,"balanceAfter") VALUES (${id},'fixture','fixture','Browser test only',500,0,500)`;
		browser = await openBrowser();
		const { send, evaluate, go, screenshot } = browser;
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 1000,
			deviceScaleFactor: 1,
			mobile: false,
		});
		const ready = () =>
			until(
				() =>
					evaluate(
						`!!document.querySelector('.rpg-hub')&&Object.keys(document.querySelector('.rpg-filters select')??{}).some(k=>k.startsWith('__reactProps'))`,
					),
				"catálogo hidratado",
			);
		await go(`${origin}/loja`, "Loja do Bito");
		await ready();
		assert.equal(
			await evaluate(`document.querySelectorAll('.rpg-item').length`),
			10,
		);
		await screenshot("rpg-desktop-shop", { viewport: true });
		const buy = (name) =>
			evaluate(
				`(()=>{const card=[...document.querySelectorAll('.rpg-item')].find(c=>c.querySelector('h2').textContent===${JSON.stringify(name)});card.querySelector('button').click()})()`,
			);
		await buy("Pergaminho da Dica");
		await until(
			() => evaluate(`document.querySelector('.rpg-dialog')?.open`),
			"confirmação aberta",
		);
		assert.ok(
			await evaluate(`document.activeElement.closest('.rpg-dialog')!==null`),
		);
		await screenshot("rpg-desktop-purchase", { viewport: true });
		await evaluate(`document.querySelector('.rpg-dialog .ui-button').click()`);
		await until(
			() =>
				evaluate(
					`document.querySelector('.rpg-confirmation')?.textContent.includes('chegou')`,
				),
			"compra confirmada",
		);
		assert.equal(
			await evaluate(`document.querySelector('[data-rpg-bits]').textContent`),
			"465",
		);
		await buy("Lente das Alternativas");
		await evaluate(`document.querySelector('.rpg-dialog .ui-button').click()`);
		await until(
			() =>
				evaluate(
					`document.querySelector('.rpg-confirmation')?.textContent.includes('Lente')`,
				),
			"segunda compra confirmada",
		);
		await buy("Pergaminho do Exemplo");
		await evaluate(`document.querySelector('.rpg-dialog .ui-button').click()`);
		await until(
			() =>
				evaluate(
					`document.querySelector('.rpg-confirmation')?.textContent.includes('Exemplo')`,
				),
			"exemplo adquirido",
		);
		await go(`${origin}/mochila`, "Sua Mochila");
		await ready();
		assert.equal(
			await evaluate(`document.querySelectorAll('.rpg-item').length`),
			3,
		);
		await screenshot("rpg-desktop-inventory", { viewport: true });
		await go(`${origin}/conquistas`, "Conquistas");
		await ready();
		assert.equal(
			await evaluate(
				`document.querySelectorAll('.rpg-achievements>li').length`,
			),
			41,
		);
		await screenshot("rpg-desktop-achievements", { viewport: true });
		await evaluate(
			`(()=>{const s=document.querySelector('.rpg-filters select');s.value='revisao';s.dispatchEvent(new Event('change',{bubbles:true}))})()`,
		);
		await until(
			() =>
				evaluate(
					`document.querySelectorAll('.rpg-achievements>li').length===5`,
				),
			"filtro de revisão",
		);
		await send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		await go(`${origin}/loja`, "Loja do Bito");
		await ready();
		await screenshot("rpg-mobile-shop", { viewport: true });
		assert.ok(
			await evaluate(`document.documentElement.scrollWidth<=innerWidth`),
		);
		await go(`${origin}/mochila`, "Sua Mochila");
		await ready();
		await screenshot("rpg-mobile-inventory", { viewport: true });
		const [point] =
			await db.$queryRaw`SELECT p.id,(SELECT title FROM "LearningActivity" a WHERE a."pointId"=p.id ORDER BY id LIMIT 1) AS title FROM "TrailPoint" p WHERE "trailSlug"='elementar' AND number=1`;
		const rows =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId" WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const first = rows.find((r) => r.type === "MULTIPLE_CHOICE");
		for (const row of rows) {
			if (row.key === first.key) break;
			const body = new FormData();
			body.set("item", row.key);
			body.set("rodada", "1");
			if (row.type === "WALKTHROUGH") body.set("resposta", "concluido");
			const r = await fetch(`${origin}/aprender/elementar/1/responder`, {
				method: "POST",
				headers: { cookie, origin },
				body,
			});
			assert.equal(r.status, 200);
		}
		await go(`${origin}/aprender/elementar/1`, point.title);
		await until(
			() =>
				evaluate(
					`Object.keys(document.querySelector('.rpg-open-bag')??{}).some(k=>k.startsWith('__reactProps'))`,
				),
			"mochila hidratada",
		);
		await evaluate(`document.querySelector('.rpg-open-bag').click()`);
		await until(
			() =>
				evaluate(`document.querySelectorAll('.rpg-lesson-bag li').length===6`),
			"itens da lição",
		);
		assert.ok(
			await evaluate(
				`document.activeElement.closest('.rpg-lesson-bag')!==null`,
			),
		);
		await screenshot("rpg-mobile-lesson-bag", { viewport: true });
		assert.ok(
			await evaluate(
				`(()=>{const r=document.querySelector('.rpg-lesson-bag').getBoundingClientRect();return Math.abs(r.bottom-innerHeight)<2&&r.height<innerHeight})()`,
			),
		);
		await evaluate(
			`(()=>{const li=[...document.querySelectorAll('.rpg-lesson-bag li')].find(i=>i.textContent.includes('Pergaminho da Dica'));li.querySelector('button').click()})()`,
		);
		await until(
			() =>
				evaluate(
					`!!document.querySelector('.rpg-question-help')&&!document.querySelector('.rpg-lesson-bag').open`,
				),
			"dica aplicada",
		);
		assert.ok(
			await evaluate(
				`document.querySelector('.rpg-question-help').textContent.includes('Dica do Bito')`,
			),
		);
		await screenshot("rpg-mobile-hint", { viewport: true, bottom: true });
		await go(`${origin}/aprender/elementar/1`, point.title);
		await until(
			() => evaluate(`!!document.querySelector('.rpg-question-help')`),
			"dica preservada após recarga",
		);
		await evaluate(`document.querySelector('.rpg-open-bag').click()`);
		await until(
			() =>
				evaluate(`document.querySelectorAll('.rpg-lesson-bag li').length===6`),
			"reabertura da mochila",
		);
		await evaluate(
			`(()=>{const li=[...document.querySelectorAll('.rpg-lesson-bag li')].find(i=>i.textContent.includes('Lente das Alternativas'));li.querySelector('button').click()})()`,
		);
		await until(
			() =>
				evaluate(
					`document.querySelectorAll('input[name=resposta]').length===2`,
				),
			"lente aplicada",
		);
		await until(
			() => evaluate(`!document.querySelector('.rpg-lesson-bag').open`),
			"efeito finalizado e mochila fechada",
		);
		await evaluate(`document.querySelector('.rpg-open-bag').click()`);
		await until(
			() =>
				evaluate(
					`document.querySelectorAll('.rpg-lesson-bag li').length===6&&!document.querySelector('.rpg-lesson-bag .rpg-close').disabled`,
				),
			"mochila pronta para exemplo",
		);
		await evaluate(
			`[...document.querySelectorAll('.rpg-lesson-bag li')].find(i=>i.textContent.includes('Pergaminho do Exemplo')).querySelector('button').click()`,
		);
		await until(
			() =>
				evaluate(
					`document.querySelectorAll('.rpg-question-help').length===2&&!document.querySelector('.rpg-lesson-bag').open`,
				),
			"exemplo e dica aplicados",
		);
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "reduce" }],
		});
		await evaluate(`document.querySelector('.rpg-open-bag').click()`);
		await until(
			() => evaluate(`document.querySelector('.rpg-lesson-bag')?.open`),
			"mochila em movimento reduzido",
		);
		assert.equal(
			await evaluate(
				`getComputedStyle(document.querySelector('.rpg-lesson-bag')).animationName`,
			),
			"none",
		);
		await screenshot("rpg-mobile-reduced-bag", { viewport: true });
		await send("Input.dispatchKeyEvent", {
			type: "keyDown",
			key: "Escape",
			code: "Escape",
			windowsVirtualKeyCode: 27,
			nativeVirtualKeyCode: 27,
		});
		await send("Input.dispatchKeyEvent", {
			type: "keyUp",
			key: "Escape",
			code: "Escape",
			windowsVirtualKeyCode: 27,
			nativeVirtualKeyCode: 27,
		});
		await until(
			() => evaluate(`!document.querySelector('.rpg-lesson-bag').open`),
			"Escape fecha mochila",
		);
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 1000,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await evaluate(`document.querySelector('.rpg-open-bag').click()`);
		await until(
			() =>
				evaluate(`document.querySelectorAll('.rpg-lesson-bag li').length===6`),
			"mochila desktop",
		);
		await screenshot("rpg-desktop-lesson-bag", { viewport: true });
		assert.ok(
			await evaluate(
				`(()=>{const r=document.querySelector('.rpg-lesson-bag').getBoundingClientRect();return Math.abs(r.right-document.documentElement.clientWidth)<2&&r.width<=460})()`,
			),
		);
		await evaluate(
			`document.querySelector('.rpg-lesson-bag .rpg-close').click()`,
		);
		await send("Emulation.setEmulatedMedia", {
			features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
		});
		await evaluate(
			`document.querySelector('input[name=resposta][value=${JSON.stringify(first.answer)}]').click()`,
		);
		await until(
			() => evaluate(`!!document.querySelector('.rpg-award-reveal')`),
			"conquista recebida em resposta real",
		);
		await screenshot("rpg-desktop-award", { viewport: true });
		await send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		await screenshot("rpg-mobile-award", { viewport: true });
		await go(`${origin}/conquistas`, "Conquistas");
		await ready();
		await screenshot("rpg-mobile-achievements", { viewport: true });
		assert.ok(
			await evaluate(`document.documentElement.scrollWidth<=innerWidth`),
		);
		await evaluate(`document.documentElement.dataset.theme='light'`);
		await screenshot("rpg-mobile-achievements-light", { viewport: true });
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 1000,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await screenshot("rpg-desktop-achievements-light", { viewport: true });
		for (const rarity of ["epic", "legendary"]) {
			await evaluate(
				`(()=>{const s=document.querySelectorAll('.rpg-filters select')[1];s.value=${JSON.stringify(rarity)};s.dispatchEvent(new Event('change',{bubbles:true}))})()`,
			);
			await until(
				() =>
					evaluate(
						`[...document.querySelectorAll('.rpg-achievements>li')].every(i=>i.dataset.rarity===${JSON.stringify(rarity)})`,
					),
				rarity,
			);
			await screenshot(`rpg-desktop-${rarity}`, { viewport: true });
		}
		await go(
			`${origin}/aprender/elementar/1?retorno=${first.key}&rodada=1`,
			point.title,
		);
		await until(
			() =>
				evaluate(
					`!!document.querySelector('.answer-experience')&&!document.querySelector('form[action$=responder]')`,
				),
			"resposta salva restaurada",
		);
		assert.equal(
			await evaluate(
				`document.querySelectorAll('main input[type=radio]').length`,
			),
			2,
		);
		assert.equal(
			await evaluate(`document.querySelectorAll('.rpg-question-help').length`),
			2,
		);
		await screenshot("rpg-desktop-saved-feedback", { viewport: true });
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
