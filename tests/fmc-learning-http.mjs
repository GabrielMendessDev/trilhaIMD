import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3337";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);

test("FMC: conteúdo, exemplo guiado, vidas, revisão, XP, material e desbloqueio normal", async () => {
	const db = new PrismaClient(),
		id = `teste-fmc-aula-${randomUUID()}`,
		token = randomUUID();
	const cookie = `authjs.session-token=${token}`;
	const page = async (path) => {
		const r = await fetch(`${origin}${path}`, { headers: { cookie } });
		assert.equal(r.status, 200);
		return (await r.text()).replace(/<!--.*?-->/gs, "");
	};
	const base = "/aprender/fmc/1";
	const send = async (entry, round = 1, answer = entry.answer) => {
		const form = new FormData();
		form.set("item", entry.key);
		form.set("rodada", String(round));
		if (entry.type === "WALKTHROUGH") form.set("resposta", "concluido");
		else if (answer !== null) form.set("resposta", answer);
		const response = await fetch(`${origin}${base}/responder`, {
			method: "POST",
			headers: { cookie, origin },
			body: form,
		});
		return { status: response.status, ...(await response.json()) };
	};
	try {
		await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Teste FMC')`;
		await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		const [point] =
			await db.$queryRaw`SELECT id,"xpReward" FROM "TrailPoint" WHERE "trailSlug"='fmc' AND number=1`;
		const entries =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer,e.payload,e.content FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		assert.equal(entries.length, 17);
		const graded = entries.filter((e) => e.answer !== null),
			missed = graded[0];
		assert.equal(graded.length, 10);
		assert.ok((await page(base)).includes("Linguagem"));
		const blocked = await fetch(`${origin}/aprender/fmc/2`, {
			headers: { cookie },
			redirect: "manual",
		});
		assert.ok((await blocked.text()).includes("Etapa bloqueada"));
		// Não é permitido pular as telas iniciais e responder uma questão futura.
		assert.equal((await send(missed)).status, 422);
		for (const entry of entries) {
			const wrong =
				entry === missed
					? entry.payload.alternativas.find((a) => a.id !== entry.answer).id
					: entry.answer;
			const result = await send(entry, 1, wrong);
			assert.equal(result.status, 200, result.error);
			if (entry === missed) {
				const [state] =
					await db.$queryRaw`SELECT lives FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
				assert.equal(state.lives, 4);
				assert.ok(
					(await page(result.destination)).includes("Resposta incorreta"),
				);
			}
		}
		let [state] =
			await db.$queryRaw`SELECT xp,lives,"completedAt" FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.equal(state.xp, 0);
		assert.equal(state.completedAt, null);
		assert.ok((await page(base)).includes("Hora de revisar!"));
		const recovered = await send(missed, 2);
		assert.equal(recovered.status, 200, recovered.error);
		assert.ok(
			(await page(recovered.destination)).includes("Questão recuperada"),
		);
		[state] =
			await db.$queryRaw`SELECT xp,lives,"completedAt","correctAnswers" FROM "LearningPointProgress" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.equal(state.xp, point.xpReward);
		assert.equal(state.correctAnswers, 10);
		assert.equal(state.lives, 4);
		assert.ok(state.completedAt);
		assert.ok((await page(base)).includes("Etapa concluída!"));
		assert.ok((await page("/aprender/fmc/2")).includes("Bases"));
		const material = entries.find((e) => e.content?.categoria === "material");
		const materialPost = async (answer) =>
			fetch(`${origin}/api/rpg`, {
				method: "POST",
				headers: { cookie, origin, "content-type": "application/json" },
				body: JSON.stringify({
					action: "material",
					pointId: point.id,
					entryKey: material.key,
					answer,
				}),
			});
		assert.equal((await materialPost()).status, 200);
		await db.$executeRaw`UPDATE "MaterialReading" SET "startedAt"=now()-interval '2 minutes' WHERE "userId"=${id} AND "pointId"=${point.id}`;
		const checks = JSON.parse(
			readFileSync(
				new URL("../src/server/fmc-material-checks.json", import.meta.url),
				"utf8",
			),
		);
		const materialResult = await materialPost(checks[0].answer);
		assert.equal(materialResult.status, 200, await materialResult.text());
		const [reading] =
			await db.$queryRaw`SELECT "completedAt" FROM "MaterialReading" WHERE "userId"=${id} AND "pointId"=${point.id}`;
		assert.ok(reading.completedAt);
	} finally {
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});

test("a aula de FMC mantém as pausas e cada fim de unidade oferece sua prova", async () => {
	const db = new PrismaClient();
	const id = `teste-fmc-percurso-${randomUUID()}`;
	const token = randomUUID();
	const headers = { cookie: `authjs.session-token=${token}` };
	const page = async (path) => {
		const response = await fetch(`${origin}${path}`, { headers });
		assert.equal(response.status, 200, path);
		return (await response.text()).replace(/<!--.*?-->/gs, "");
	};
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste de percurso')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`,
		]);
		const [point] =
			await db.$queryRaw`SELECT id, EXISTS(SELECT 1 FROM "TrailPointContent" WHERE "pointId"=p.id) AS intro FROM "TrailPoint" p WHERE "trailSlug"='fmc' AND number=1`;
		const entries =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key FROM "LearningEntry" e JOIN "LearningActivity" a ON a.id=e."activityId" WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number LIMIT 6`;
		const completed = [
			...(point.intro ? ["leitura"] : []),
			...entries.map(({ key }) => key),
		].slice(0, 6);
		assert.equal(completed.length, 6);
		await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedEntries") VALUES (${id},${point.id},${completed}::text[])`;
		assert.match(await page("/aprender/fmc/1"), /Sessão 2 de 3/);

		const points =
			await db.$queryRaw`SELECT id,"trailSlug" AS trail,number FROM "TrailPoint" WHERE ("trailSlug"='fmc' AND number IN (6,12,18)) OR ("trailSlug"='elementar' AND number IN (19,20,40,60))`;
		assert.equal(points.length, 7);
		for (const { id: pointId, trail, number } of points) {
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") VALUES (${id},${pointId},timezone('UTC',now()))`;
			const html = await page(`/aprender/${trail}/${number}`);
			if (number === 19) {
				assert.doesNotMatch(html, />Fazer a Prova \d<\/a>/);
				continue;
			}
			const unit = number / (trail === "fmc" ? 6 : 20);
			assert.ok(
				html.includes(
					`href="/aprender/${trail}/prova-${unit}">Fazer a Prova ${unit}</a>`,
				),
				`Link da prova da unidade ${unit} de ${trail}`,
			);
		}
	} finally {
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
