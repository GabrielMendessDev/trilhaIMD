import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3319")
	.origin;
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
test("mochila permite passe e troca na prática do checkpoint e protege só a verificação", {
	timeout: 120000,
}, async () => {
	const id = `teste-items-browser-${randomUUID()}`,
		token = randomUUID(),
		cookie = `authjs.session-token=${token}`;
	let browser;
	try {
		await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Auditoria temporária no navegador')`;
		await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedAt",xp) SELECT ${id},id,now(),0 FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number<5`;
		assert.equal(
			(await fetch(`${origin}/api/rpg`, { headers: { cookie } })).status,
			200,
		);
		await db.$executeRaw`UPDATE "RpgWallet" SET bits=700 WHERE "userId"=${id}`;
		await db.$executeRaw`INSERT INTO "CurrencyTransaction"("userId",key,kind,subject,bits,xp,"balanceAfter") VALUES (${id},'fixture-items-browser','fixture','Temporary browser fixture',700,0,700)`;
		for (const itemId of [
			"question-pass",
			"question-pass",
			"challenge-swap",
			"challenge-swap",
			"hint-scroll",
		]) {
			const r = await fetch(`${origin}/api/rpg`, {
				method: "POST",
				headers: { cookie, origin, "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "buy",
					itemId,
					requestId: randomUUID(),
				}),
			});
			assert.equal(r.status, 200, await r.clone().text());
		}
		const [point] =
			await db.$queryRaw`SELECT p.id,EXISTS(SELECT 1 FROM "TrailPointContent" c WHERE c."pointId"=p.id) AS intro,(SELECT title FROM "LearningActivity" a WHERE a."pointId"=p.id ORDER BY id LIMIT 1) AS title FROM "TrailPoint" p WHERE "trailSlug"='elementar' AND number=5`;
		const rows =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const graded = rows.filter(
				(e) => e.type !== null && e.type !== "WALKTHROUGH",
			),
			first = graded[0],
			last = graded.at(-1);
		const prefix = (entry) => [
			...(point.intro ? ["leitura"] : []),
			...rows
				.slice(
					0,
					rows.findIndex((r) => r.key === entry.key),
				)
				.map((e) => e.key),
		];
		await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedEntries") VALUES (${id},${point.id},${prefix(first)}::text[])`;
		browser = await openBrowser();
		const { send, evaluate, go, screenshot } = browser;
		await send("Emulation.setFocusEmulationEnabled", { enabled: true });
		await send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		const key = () =>
			evaluate(`document.querySelector('input[name=item]')?.value`);
		const slot = (name) =>
			`[...document.querySelectorAll('.rpg-lesson-bag li')].find(e=>e.querySelector('h3')?.textContent.startsWith(${JSON.stringify(name)}))`;
		async function openBag() {
			await until(
				() =>
					evaluate(
						`!document.querySelector('.rpg-open-bag')?.disabled && Object.keys(document.querySelector('.rpg-open-bag')??{}).some(k=>k.startsWith('__reactProps'))`,
					),
				"mochila hidratada",
			);
			await evaluate(`document.querySelector('.rpg-open-bag').click()`);
			await until(
				() =>
					evaluate(
						`document.querySelector('.rpg-lesson-bag').open && !document.querySelector('.rpg-lesson-bag .rpg-close').disabled && document.querySelectorAll('.rpg-lesson-bag li').length===6`,
					),
				"itens carregados",
			);
		}
		await go(`${origin}/aprender/elementar/5`, point.title);
		await until(
			async () => (await key()) === first.key,
			"prática do checkpoint",
		);
		await openBag();
		for (const name of ["Passe de Questão", "Troca de Desafio"])
			assert.equal(
				await evaluate(`${slot(name)}.querySelector('button').disabled`),
				false,
			);
		await screenshot("items-checkpoint-practice-mobile", { viewport: true });
		await evaluate(
			`${slot("Troca de Desafio")}.querySelector('button').click()`,
		);
		await until(
			() =>
				evaluate(
					`!document.querySelector('.rpg-lesson-bag').open && !!document.querySelector('input[name=variant]').value`,
				),
			"troca aplicada",
		);
		await openBag();
		await evaluate(
			`${slot("Passe de Questão")}.querySelector('button').click()`,
		);
		await until(
			() => evaluate(`!!document.querySelector('.rpg-skip-confirm')`),
			"confirmação do passe",
		);
		await evaluate(
			`document.querySelector('.rpg-skip-confirm .ui-button').click()`,
		);
		await until(
			async () =>
				(await key()) ===
				rows[rows.findIndex((e) => e.key === first.key) + 1].key,
			"passe avançou sem resposta",
		);
		const [state] =
			await db.$queryRaw`SELECT attempts,"skippedEntries" FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.ok(state.skippedEntries.includes(first.key));
		assert.equal(state.attempts[first.key], undefined);
		await db.$executeRaw`UPDATE "LearningPointProgress" SET "completedEntries"=${prefix(last)}::text[] WHERE "userId"=${id} AND "pointId"=${point.id}`;
		await go(`${origin}/aprender/elementar/5?item=${last.key}`, point.title);
		await until(
			async () => (await key()) === last.key,
			"verificação final do checkpoint",
		);
		await openBag();
		for (const name of ["Passe de Questão", "Troca de Desafio"]) {
			assert.equal(
				await evaluate(`${slot(name)}.querySelector('button').disabled`),
				true,
			);
			assert.match(
				await evaluate(`${slot(name)}.textContent`),
				/questão essencial/,
			);
		}
		assert.equal(
			await evaluate(
				`${slot("Pergaminho da Dica")}.querySelector('button').disabled`,
			),
			false,
		);
		await screenshot("items-checkpoint-essential-mobile", { viewport: true });
	} catch (error) {
		if (browser)
			console.error(
				await browser.evaluate(
					`({url:location.href,key:document.querySelector('input[name=item]')?.value,bagOpen:document.querySelector('.rpg-lesson-bag')?.open,alerts:[...document.querySelectorAll('[role=alert],.study-error')].map(e=>e.textContent),confirm:!!document.querySelector('.rpg-skip-confirm'),busy:document.querySelector('.rpg-open-bag')?.disabled})`,
				),
			);
		console.error(
			await db.$queryRaw`SELECT "pointId","skippedEntries",attempts FROM "LearningPointProgress" WHERE "userId"=${id} AND "completedAt" IS NULL`,
		);
		console.error(
			await db.$queryRaw`SELECT "itemId",result->>'destination' AS destination FROM "ItemUsage" WHERE "userId"=${id} ORDER BY id`,
		);
		throw error;
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
