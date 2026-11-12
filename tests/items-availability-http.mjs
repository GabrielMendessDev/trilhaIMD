import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { items } from "../src/domain/rpg.ts";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3319")
	.origin;
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
assert.ok(
	["127.0.0.1", "localhost"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
const consumables = items.filter(
	(i) => i.kind === "consumable" && i.id !== "streak-shield",
);

test("auditoria de compatibilidade usa a API real em todas as questões publicadas", {
	timeout: 180000,
}, async () => {
	const id = `teste-items-audit-${randomUUID()}`,
		token = randomUUID();
	const cookie = `authjs.session-token=${token}`;
	const report = {
		scenario:
			"Primeira rodada; questão atual; estoque positivo; sem auxílios e sem pulos prévios. Cobertura não é cota de pulos por sessão.",
		points: [],
		totals: Object.fromEntries(consumables.map((i) => [i.id, 0])),
	};
	try {
		await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Auditoria temporária de itens')`;
		await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		const initial = await fetch(`${origin}/api/rpg`, { headers: { cookie } });
		assert.equal(initial.status, 200);
		for (const item of consumables)
			await db.$executeRaw`INSERT INTO "InventoryItem"("userId","itemId",quantity) VALUES (${id},${item.id},1)`;
		const points =
			await db.$queryRaw`SELECT p.id,p.number,p."trailSlug" AS trail,EXISTS(SELECT 1 FROM "TrailPointContent" c WHERE c."pointId"=p.id) AS intro FROM "TrailPoint" p WHERE EXISTS(SELECT 1 FROM "LearningActivity" a WHERE a."pointId"=p.id) ORDER BY p."trailSlug",p.number`;
		for (const point of points) {
			const rows =
				await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
			const totals = Object.fromEntries(consumables.map((i) => [i.id, 0]));
			const coverage = [];
			for (const [index, entry] of rows.entries()) {
				if (entry.type === null || entry.type === "WALKTHROUGH") continue;
				const completed = [
					...(point.intro ? ["leitura"] : []),
					...rows.slice(0, index).map((e) => e.key),
				];
				await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedEntries") VALUES (${id},${point.id},${completed}::text[]) ON CONFLICT ("userId","pointId") DO UPDATE SET "completedEntries"=EXCLUDED."completedEntries",attempts='{}'::jsonb,"skippedEntries"=ARRAY[]::text[],"deferredEntries"=ARRAY[]::text[],"completedAt"=NULL,xp=0,"correctAnswers"=0`;
				const response = await fetch(
					`${origin}/api/rpg?pointId=${point.id}&entryKey=${entry.key}&round=1`,
					{ headers: { cookie } },
				);
				const bag = await response.json();
				assert.equal(response.status, 200, JSON.stringify(bag));
				const availability = Object.fromEntries(
					consumables.map((item) => {
						const slot = bag.inventory.find((i) => i.id === item.id);
						assert.equal(slot.quantity, 1);
						if (slot.reason === null) {
							totals[item.id]++;
							report.totals[item.id]++;
						}
						return [item.id, slot.reason];
					}),
				);
				coverage.push({ key: entry.key, type: entry.type, availability });
			}
			const graded = coverage.length;
			assert.ok(
				totals["question-pass"] > 0,
				`Passe inutilizável: ${point.trail}/${point.number}`,
			);
			if (point.trail === "elementar") {
				assert.ok(
					totals["challenge-swap"] > 0,
					`Troca inutilizável: ${point.number}`,
				);
				assert.ok(
					totals["example-scroll"] > 0,
					`Exemplo inutilizável: ${point.number}`,
				);
				assert.equal(totals["hint-scroll"], graded);
				if (point.number === 5 || point.number === 10) {
					assert.equal(totals["question-pass"], graded - 1);
					assert.match(
						coverage.at(-1).availability["question-pass"],
						/questão essencial/,
					);
				} else assert.equal(totals["question-pass"], graded);
			}
			report.points.push({
				...point,
				graded,
				maximumSkips: Math.floor(graded / 2),
				totals,
				coverage,
			});
			await db.$executeRaw`UPDATE "LearningPointProgress" SET "completedAt"=now() WHERE "userId"=${id} AND "pointId"=${point.id}`;
		}
		await mkdir("tests/artifacts", { recursive: true });
		await writeFile(
			"tests/artifacts/items-availability.json",
			JSON.stringify(report, null, 2),
		);
		console.log(
			JSON.stringify({
				points: report.points.length,
				questions: report.points.reduce((sum, p) => sum + p.graded, 0),
				totals: report.totals,
			}),
		);
	} finally {
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
