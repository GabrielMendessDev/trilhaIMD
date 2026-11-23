import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { unitOneExam } from "../src/server/me-exam-bank.mjs";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3319";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
test("prova salva, retoma, protege propriedade, entrega uma vez e permite nova tentativa", async () => {
	const id = `teste-prova-${randomUUID()}`,
		token = randomUUID();
	const otherId = `${id}-outro`;
	const foreignAttempt = randomUUID();
	const endpoint = `${origin}/aprender/elementar/prova-1/responder`;
	const cookie = `authjs.session-token=${token}`;
	const post = async (values) => {
		const body = new URLSearchParams(values);
		return fetch(endpoint, {
			method: "POST",
			headers: { cookie, origin },
			body,
			redirect: "manual",
		});
	};
	try {
		await db.$transaction([
			db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste Prova')`,
			db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},now()+interval '1 hour')`,
		]);
		const unauth = await fetch(endpoint, {
			method: "POST",
			headers: { origin },
			body: new URLSearchParams({ action: "start" }),
		});
		assert.equal(unauth.status, 401);
		const planBefore = await (
			await fetch(`${origin}/aprender/elementar/plano`, { headers: { cookie } })
		).text();
		assert.ok(planBefore.includes("Conclua as etapas 1 a 20"));
		assert.ok(!planBefore.includes("Abrir Prova 1"));
		const blocked = await post({ action: "start" });
		assert.equal(blocked.status, 403);
		const lockedPage = await fetch(`${origin}/aprender/elementar/prova-1`, {
			headers: { cookie },
			redirect: "manual",
		});
		const lockedHtml = await lockedPage.text();
		assert.ok(
			lockedPage.status === 307 || lockedHtml.includes("NEXT_REDIRECT"),
		);
		assert.ok(!lockedHtml.includes("Iniciar nova tentativa"));
		await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number BETWEEN 1 AND 19`;
		assert.equal((await post({ action: "start" })).status, 403);
		await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=20`;
		await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${otherId},'Outro estudante de teste')`;
		await db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",questions) VALUES (${foreignAttempt},${otherId},${JSON.stringify(unitOneExam)}::jsonb)`;
		const foreign = await post({
			action: "save",
			attempt: foreignAttempt,
			revision: "0",
			question: unitOneExam[0].id,
			answer: unitOneExam[0].answer,
		});
		assert.equal(foreign.status, 404);
		const foreignPage = await fetch(
			`${origin}/aprender/elementar/prova-1?tentativa=${foreignAttempt}`,
			{ headers: { cookie } },
		);
		const foreignHtml = await foreignPage.text();
		assert.ok(foreignHtml.includes("Página fora da trilha"));
		assert.ok(!foreignHtml.includes(unitOneExam[0].prompt));
		const planAfter = await (
			await fetch(`${origin}/aprender/elementar/plano`, { headers: { cookie } })
		).text();
		assert.ok(planAfter.includes("Abrir Prova 1"));
		const start = await post({ action: "start" });
		assert.equal(start.status, 303);
		const attempt = new URL(start.headers.get("location")).searchParams.get(
			"tentativa",
		);
		let revision = 0;
		const first = unitOneExam[0];
		const save = await post({
			action: "save",
			attempt,
			revision: String(revision),
			question: first.id,
			answer: first.answer,
		});
		assert.equal(save.status, 303);
		revision++;
		const stale = await post({
			action: "save",
			attempt,
			revision: "0",
			question: first.id,
			answer: "errada",
		});
		assert.ok(stale.headers.get("location").includes("atualizada"));
		const denied = await post({
			action: "save",
			attempt: randomUUID(),
			revision: "0",
			question: first.id,
			answer: first.answer,
		});
		assert.equal(denied.status, 404);
		const partial = await post({
			action: "finish",
			attempt,
			revision: String(revision),
			question: first.id,
			answer: first.answer,
		});
		assert.ok(partial.headers.get("location").includes("incompleta"));
		revision++;
		let [row] =
			await db.$queryRaw`SELECT * FROM "MeExamAttempt" WHERE id=${attempt}`;
		assert.equal(row.submittedAt, null);
		assert.equal(row.answers[first.id], first.answer);
		const page = await fetch(
			`${origin}/aprender/elementar/prova-1?tentativa=${attempt}`,
			{ headers: { cookie } },
		).then((r) => r.text());
		assert.ok(page.includes("resposta salva"));
		assert.ok(!page.includes("Resposta correta"));
		for (const q of unitOneExam.slice(1)) {
			const r = await post({
				action: q === unitOneExam.at(-1) ? "finish" : "save",
				attempt,
				revision: String(revision),
				question: q.id,
				answer: q.answer,
			});
			assert.equal(r.status, 303);
			revision++;
		}
		[row] =
			await db.$queryRaw`SELECT * FROM "MeExamAttempt" WHERE id=${attempt}`;
		assert.equal(row.score, 20);
		assert.ok(row.submittedAt);
		await post({
			action: "finish",
			attempt,
			revision: String(revision),
			question: first.id,
			answer: "errada",
		});
		const [unchanged] =
			await db.$queryRaw`SELECT score,revision FROM "MeExamAttempt" WHERE id=${attempt}`;
		assert.equal(unchanged.score, 20);
		assert.equal(unchanged.revision, revision);
		const second = await post({ action: "start" });
		assert.notEqual(
			new URL(second.headers.get("location")).searchParams.get("tentativa"),
			attempt,
		);
	} finally {
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id} OR id=${otherId}`;
		await db.$disconnect();
	}
});
