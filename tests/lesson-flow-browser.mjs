import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { openBrowser, until } from "./browser-client.mjs";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3319")
	.origin;
const databaseUrl =
	process.env.TRILBIT_TEST_DATABASE_URL ?? process.env.DATABASE_URL;
for (const url of [origin, databaseUrl]) {
	assert.ok(["localhost", "127.0.0.1"].includes(new URL(url).hostname));
}
const db = new PrismaClient({ datasourceUrl: databaseUrl });
const path = "/aprender/elementar/1";

test("a lição troca de questão, abre a Mochila e retoma uma pausa sem recarregar a etapa", {
	timeout: 120000,
}, async () => {
	const id = `teste-fluxo-${randomUUID()}`;
	const token = randomUUID();
	let browser;
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id, name) VALUES (${id}, 'Estudante de teste')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`,
		]);
		const [point] = await db.$queryRaw`SELECT p.id,
			EXISTS(SELECT 1 FROM "TrailPointContent" c WHERE c."pointId"=p.id) AS intro,
			(SELECT title FROM "LearningActivity" a WHERE a."pointId"=p.id ORDER BY id LIMIT 1) AS title
			FROM "TrailPoint" p WHERE p."trailSlug"='elementar' AND p.number=1`;
		const rows =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer,
			e.content->>'categoria' AS category
			FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId"
			WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const entries = point.intro ? [{ key: "leitura" }, ...rows] : rows;
		const index = entries.findIndex(({ type }) => type === "MULTIPLE_CHOICE");
		assert.ok(index >= 0 && index < 5);
		const question = entries[index];
		const next = entries[index + 1];
		assert.ok(
			next &&
				entries[6] &&
				entries.some(({ category }) => category === "material"),
		);
		const completed = (count) => entries.slice(0, count).map(({ key }) => key);
		await db.$transaction([
			db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedEntries",lives)
				VALUES (${id},${point.id},${completed(index)}::text[],4)`,
			db.$executeRaw`INSERT INTO "InventoryItem" ("userId","itemId",quantity) VALUES (${id},'life-drop',1)`,
		]);

		browser = await openBrowser();
		const { send, evaluate, go, screenshot } = browser;
		const requests = [];
		await send("Network.enable");
		browser.on("Network.requestWillBeSent", ({ request }) => {
			const url = new URL(request.url);
			if (
				request.method === "GET" &&
				(url.pathname === path || url.pathname === "/api/rpg")
			)
				requests.push(url.pathname);
		});
		await send("Emulation.setDeviceMetricsOverride", {
			width: 1440,
			height: 900,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await send("Network.setCookie", {
			name: "authjs.session-token",
			value: token,
			url: origin,
			httpOnly: true,
		});
		const hydrated = () =>
			until(
				() =>
					evaluate(
						"Object.keys(document.querySelector('form[action$=responder]') ?? {}).some(key => key.startsWith('__reactProps'))",
					),
				"formulário hidratado",
			);
		const btn = (text) =>
			evaluate(
				`[...document.querySelectorAll('main button')].find(button => button.textContent.trim() === ${JSON.stringify(text)})?.click()`,
			);
		const monitor = () =>
			evaluate(`window.lessonLoaders = 0;
			new MutationObserver(records => {
				for (const record of records) for (const node of record.addedNodes) {
					if (node instanceof Element && (node.matches('[data-route-loading]') || node.querySelector('[data-route-loading]')))
						window.lessonLoaders++;
				}
			}).observe(document.body, { childList: true, subtree: true }); true;`);
		const unchanged = async (previous) => {
			assert.equal(await evaluate("window.lessonLoaders"), 0);
			assert.deepEqual(requests.slice(previous), []);
		};
		await go(origin + path, point.title);
		await hydrated();
		await monitor();
		const beforeAnswer = requests.length;
		assert.equal(
			await evaluate(`document.querySelector('.rpg-open-bag').click();
			document.querySelector('.rpg-lesson-bag').open &&
			document.querySelectorAll('.rpg-lesson-bag li').length > 0`),
			true,
		);
		await screenshot("mochila-precarregada-desktop");
		await evaluate(`[...document.querySelectorAll('.rpg-lesson-bag li')]
			.find(row => row.querySelector('h3').textContent.includes('Gota de Vida')).querySelector('button').click()`);
		await until(
			() =>
				evaluate(
					"Boolean(document.querySelector('[data-lives=\"5\"]')) && !document.querySelector('.rpg-lesson-bag').open",
				),
			"item e vidas atualizados",
		);
		await evaluate(`[...document.querySelectorAll('input[name=resposta]')]
			.find(input => input.value === ${JSON.stringify(question.answer)}).click()`);
		await until(
			() => evaluate("Boolean(document.querySelector('.answer-continue'))"),
			"resposta confirmada",
		);
		await evaluate("document.querySelector('.answer-continue').click()");
		await until(
			() =>
				evaluate(
					`document.querySelector('input[name=item]')?.value === ${JSON.stringify(next.key)}`,
				),
			"próxima tela",
		);
		await unchanged(beforeAnswer);

		for (const entry of entries.slice(index + 1, 6)) {
			await until(
				() =>
					evaluate(
						`document.querySelector('input[name=item]')?.value === ${JSON.stringify(entry.key)}`,
					),
				"tela anterior à pausa",
			);
			if (entry.type === "MULTIPLE_CHOICE") {
				await evaluate(`[...document.querySelectorAll('input[name=resposta]')]
					.find(input => input.value === ${JSON.stringify(entry.answer)}).click()`);
				await until(
					() => evaluate("Boolean(document.querySelector('.answer-continue'))"),
					"correção antes da pausa",
				);
				await evaluate("document.querySelector('.answer-continue').click()");
			} else {
				assert.ok(!entry.type || entry.type === "WALKTHROUGH");
				if (entry.type === "WALKTHROUGH") {
					await until(async () => {
						if (
							await evaluate(
								"document.querySelector('input[name=resposta][value=concluido]') !== null",
							)
						)
							return true;
						await btn("Próximo passo");
						return false;
					}, "roteiro concluído");
				}
				await evaluate(
					"document.querySelector('form[action$=responder] button[type=submit]').click()",
				);
			}
		}
		await send("Emulation.setDeviceMetricsOverride", {
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			mobile: true,
		});
		await until(
			() =>
				evaluate(
					"Object.keys(document.querySelector('.session-arrival button') ?? {}).some(key => key.startsWith('__reactProps'))",
				),
			"pausa hidratada",
		);
		await btn("Fazer uma pausa");
		await until(
			() =>
				evaluate(
					"document.querySelector('.session-arrival h2')?.textContent === 'Sessão pausada'",
				),
			"pausa local",
		);
		await btn("Retomar sessão");
		await hydrated();
		assert.ok(
			await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
		);
		await evaluate(`const link = document.querySelector('main details a[href*="?material="]');
			link.closest('details').open = true; link.click();`);
		await until(
			() =>
				evaluate(
					"location.search.startsWith('?material=') && Boolean(document.querySelector('.rpg-material-check'))",
				),
			"material imediato",
		);
		await until(
			() =>
				evaluate(
					"Boolean(document.querySelector('.rpg-material-check legend'))",
				),
			"verificação do material registrada",
		);
		await btn("Voltar à lição");
		await until(
			() =>
				evaluate(
					"!location.search.includes('material=') && !document.querySelector('.rpg-material-check')",
				),
			"retorno à lição",
		);
		await unchanged(beforeAnswer);
	} finally {
		await browser?.close();
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
