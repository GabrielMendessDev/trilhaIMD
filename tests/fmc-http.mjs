import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { getExamDefinition } from "../src/server/me-exam-bank.mjs";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL ?? "http://localhost:3337";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
for (const unit of [1, 2, 3])
	test(`FMC Prova ${unit}: liberação, salvamento, entrega, histórico e isolamento`, async () => {
		const db = new PrismaClient();
		const questions = getExamDefinition(unit, "fmc").questions;
		const begin = (unit - 1) * 6 + 1,
			end = unit * 6;
		const base = `${origin}/aprender/fmc/prova-${unit}`;
		const id = `teste-fmc-prova-${randomUUID()}`,
			token = randomUUID();
		const otherId = `${id}-outro`;
		const foreignAttempt = randomUUID();
		const endpoint = `${base}/responder`;
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
				await fetch(`${origin}/aprender/fmc/plano`, {
					headers: { cookie },
				})
			)
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(planBefore.includes(`Conclua as etapas ${begin} a ${end}`));
			assert.ok(!planBefore.includes(`Abrir Prova ${unit}`));
			const blocked = await post({ action: "start" });
			assert.equal(blocked.status, 403);
			const lockedPage = await fetch(`${base}`, {
				headers: { cookie },
				redirect: "manual",
			});
			const lockedHtml = await lockedPage
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(
				lockedPage.status === 307 || lockedHtml.includes("NEXT_REDIRECT"),
			);
			assert.ok(!lockedHtml.includes("Iniciar nova tentativa"));
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='fmc' AND number BETWEEN ${begin} AND ${end - 1}`;
			assert.equal((await post({ action: "start" })).status, 403);
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='fmc' AND number=${end}`;
			await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${otherId},'Outro estudante de teste')`;
			await db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",unit,trail,questions) VALUES (${foreignAttempt},${otherId},${unit},'fmc',${JSON.stringify(questions)}::jsonb)`;
			const foreign = await post({
				action: "save",
				attempt: foreignAttempt,
				revision: "0",
				question: questions[0].id,
				answer: questions[0].answer,
			});
			assert.equal(foreign.status, 404);
			const foreignPage = await fetch(`${base}?tentativa=${foreignAttempt}`, {
				headers: { cookie },
			});
			const foreignHtml = await foreignPage
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(foreignHtml.includes("Página fora da trilha"));
			assert.ok(!foreignHtml.includes(questions[0].prompt));
			const planAfter = await (
				await fetch(`${origin}/aprender/fmc/plano`, {
					headers: { cookie },
				})
			)
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(planAfter.includes(`Abrir Prova ${unit}`));
			const start = await post({ action: "start" });
			assert.equal(start.status, 303);
			const attempt = new URL(start.headers.get("location")).searchParams.get(
				"tentativa",
			);
			let revision = 0;
			const first = questions[0];
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
			assert.equal(row.unit, unit);
			assert.equal(row.trail, "fmc");
			assert.equal(row.answers[first.id], first.answer);
			const page = await fetch(`${base}?tentativa=${attempt}`, {
				headers: { cookie },
			}).then((r) => r.text().then((html) => html.replace(/<!--.*?-->/gs, "")));
			assert.ok(page.includes("resposta salva"));
			assert.ok(!page.includes("Resposta correta"));
			for (const q of questions.slice(1)) {
				const r = await post({
					action: q === questions.at(-1) ? "finish" : "save",
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
			const other = unit === 3 ? 1 : unit + 1;
			const otherBase = `${origin}/aprender/fmc/prova-${other}`;
			const otherQuestion = getExamDefinition(other, "fmc").questions[0];
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='fmc' AND number BETWEEN ${(other - 1) * 6 + 1} AND ${other * 6}`;
			const cross = await fetch(`${otherBase}/responder`, {
				method: "POST",
				headers: { cookie, origin },
				redirect: "manual",
				body: new URLSearchParams({
					action: "save",
					attempt,
					revision: String(revision),
					question: otherQuestion.id,
					answer: otherQuestion.answer,
				}),
			});
			assert.equal(cross.status, 404);
			const crossPage = await (
				await fetch(`${otherBase}?tentativa=${attempt}`, {
					headers: { cookie },
				})
			)
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(!crossPage.includes(questions[0].prompt));
			const foreignHistory = await (
				await fetch(otherBase, { headers: { cookie } })
			)
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(!foreignHistory.includes(`tentativa=${attempt}`));
			const ownHistory = await (await fetch(base, { headers: { cookie } }))
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(ownHistory.includes(`tentativa=${attempt}`));
			// A prova de ME da mesma unidade não pode ler nem alterar esta tentativa.
			await db.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt") SELECT ${id},id,now() FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number BETWEEN ${(unit - 1) * 20 + 1} AND ${unit * 20}`;
			const meBase = `${origin}/aprender/elementar/prova-${unit}`;
			const meWrite = await fetch(`${meBase}/responder`, {
				method: "POST",
				headers: { cookie, origin },
				redirect: "manual",
				body: new URLSearchParams({
					action: "save",
					attempt,
					revision: String(revision),
					question: first.id,
					answer: first.answer,
				}),
			});
			assert.equal(meWrite.status, 404);
			const meRead = await fetch(`${meBase}?tentativa=${attempt}`, {
				headers: { cookie },
			}).then((r) => r.text());
			assert.ok(!meRead.includes(first.prompt));
			const meStart = await fetch(`${meBase}/responder`, {
				method: "POST",
				headers: { cookie, origin },
				redirect: "manual",
				body: new URLSearchParams({ action: "start" }),
			});
			const meAttempt = new URL(
				meStart.headers.get("location"),
			).searchParams.get("tentativa");
			assert.equal(
				(
					await post({
						action: "save",
						attempt: meAttempt,
						revision: "0",
						question: first.id,
						answer: first.answer,
					})
				).status,
				404,
			);
			const fmcHistory = await fetch(base, { headers: { cookie } }).then((r) =>
				r.text(),
			);
			assert.ok(!fmcHistory.includes(`tentativa=${meAttempt}`));
			const resultHtml = await (
				await fetch(`${base}?tentativa=${attempt}`, { headers: { cookie } })
			)
				.text()
				.then((html) => html.replace(/<!--.*?-->/gs, ""));
			assert.ok(resultHtml.includes("Resposta correta"));
			assert.ok(resultHtml.includes(questions[0].explanation));
			const csrf = await fetch(endpoint, {
				method: "POST",
				headers: { cookie, origin: "https://invalid.example" },
				body: new URLSearchParams({ action: "start" }),
			});
			assert.equal(csrf.status, 403);
		} finally {
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id} OR id=${otherId}`;
			await db.$disconnect();
		}
	});
