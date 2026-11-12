import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";

process.loadEnvFile();
const origin = process.env.TRILBIT_TEST_URL;
assert.ok(
	origin && ["localhost", "127.0.0.1"].includes(new URL(origin).hostname),
);
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const db = new PrismaClient();
const students = [];
async function post(u, body) {
	const r = await fetch(origin + "/api/rpg", {
		method: "POST",
		headers: { cookie: u.cookie, origin, "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	return { status: r.status, ...(await r.json()) };
}
async function learner() {
	const id = `teste-vidas-${randomUUID()}`,
		token = randomUUID();
	students.push(id);
	await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Teste de vidas')`;
	await db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
	const u = { id, cookie: `authjs.session-token=${token}` };
	const r = await fetch(origin + "/api/rpg", { headers: { cookie: u.cookie } });
	assert.equal(r.status, 200, await r.clone().text());
	return u;
}
async function progress(u, pointId) {
	const [row] =
		await db.$queryRaw`SELECT * FROM "LearningPointProgress" WHERE "userId"=${u.id} AND "pointId"=${pointId}`;
	return row;
}
async function submit(u, e, value = e.answer, round = 1, run = 1) {
	const form = new FormData();
	form.set("item", e.key);
	form.set("rodada", String(round));
	form.set("run", String(run));
	if (e.type === "WALKTHROUGH") form.set("resposta", "concluido");
	else if (value !== null) form.set("resposta", value);
	const r = await fetch(origin + "/aprender/elementar/1/responder", {
		method: "POST",
		headers: { cookie: u.cookie, origin },
		body: form,
	});
	return { status: r.status, ...(await r.json()) };
}
const wrong = (e) => e.payload.alternativas.find((a) => a.id !== e.answer).id;

test("vidas, perda, revisão, recomeço e reposições são transacionais e persistem no PostgreSQL", {
	timeout: 240000,
}, async () => {
	try {
		const [p] =
			await db.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=1`;
		const rows =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.* FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId"=a.id WHERE a."pointId"=${p.id} ORDER BY COALESCE(e.position,e.number)`;
		const graded = rows.filter((e) => e.type === "MULTIPLE_CHOICE");
		assert.equal(graded.length, 10);
		const failed = await learner();
		let mistakes = 0,
			last;
		for (const e of rows) {
			const bad = e.type === "MULTIPLE_CHOICE";
			const result = await submit(failed, e, bad ? wrong(e) : e.answer);
			assert.equal(result.status, 200, JSON.stringify(result));
			if (bad) {
				mistakes++;
				assert.equal(result.assessment.lives, 5 - mistakes);
				last = e;
			}
			if (mistakes === 5) {
				assert.equal(result.assessment.failed, true);
				assert.equal(result.assessment.finished, false);
				break;
			}
		}
		let row = await progress(failed, p.id);
		assert.equal(row.lives, 0);
		assert.equal(row.completedAt, null);
		assert.equal(row.xp, 0);
		const repeat = await Promise.all([
			submit(failed, last, wrong(last)),
			submit(failed, last, wrong(last)),
		]);
		assert.ok(
			repeat.every((r) => r.status === 200 && r.assessment.lives === 0),
		);
		assert.equal(
			(await submit(failed, graded[5], graded[5].answer)).status,
			422,
		);
		const html = await (
			await fetch(origin + "/aprender/elementar/1", {
				headers: { cookie: failed.cookie },
			})
		).text();
		assert.match(html, /Atividade perdida/);
		assert.doesNotMatch(html, /Etapa concluída!/);
		const archived =
			await db.$queryRaw`SELECT payload FROM "RpgEvent" WHERE "userId"=${failed.id} AND key=${`lesson-failed:${p.id}:1`}`;
		assert.equal(archived.length, 1);
		assert.equal(Object.keys(archived[0].payload.progress.attempts).length, 5);
		const restart = {
			action: "restart",
			pointId: p.id,
			lessonRun: 1,
			requestId: randomUUID(),
		};
		const reopened = await Promise.all([
			post(failed, restart),
			post(failed, restart),
		]);
		assert.ok(
			reopened.every((r) => r.status === 200 && r.run === 2 && r.lives === 5),
		);
		row = await progress(failed, p.id);
		assert.equal(row.run, 2);
		assert.equal(row.lives, 5);
		assert.deepEqual(row.completedEntries, []);
		assert.deepEqual(row.attempts, {});
		assert.equal((await submit(failed, rows[0], null, 1, 1)).status, 422);
		assert.equal(
			(
				await post(failed, {
					...restart,
					requestId: randomUUID(),
					lessonRun: 2,
				})
			).status,
			409,
		);
		for (const e of rows) {
			const r = await submit(failed, e, e.answer, 1, 2);
			assert.equal(r.status, 200, JSON.stringify(r));
			if (e === graded[0]) break;
		}
		const [events] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "RpgEvent" WHERE "userId"=${failed.id} AND key=${`answer:${p.id}:${graded[0].key}:1`}`;
		assert.equal(events.count, 1);

		const review = await learner();
		for (const e of rows) {
			const result = await submit(
				review,
				e,
				graded.slice(0, 2).includes(e) ? wrong(e) : e.answer,
			);
			assert.equal(result.status, 200, JSON.stringify(result));
		}
		assert.equal((await progress(review, p.id)).lives, 3);
		const useReview = await post(review, {
			action: "use",
			itemId: "life-drop",
			pointId: p.id,
			entryKey: graded[0].key,
			round: 2,
			requestId: randomUUID(),
		});
		assert.equal(useReview.status, 422);
		assert.match(useReview.error, /revisão/);
		const rr = await submit(review, graded[0], wrong(graded[0]), 2);
		assert.equal(rr.status, 200);
		assert.equal(rr.assessment.lives, 3);
		assert.equal(rr.assessment.failed, false);
		const final = await submit(review, graded[1], graded[1].answer, 2);
		assert.equal(final.status, 200);
		assert.equal(final.assessment.finished, true);
		assert.equal(final.assessment.lives, 3);
		assert.ok((await progress(review, p.id)).completedAt);
		assert.equal((await progress(review, p.id)).xp, 10);
		assert.equal(
			(
				await post(review, {
					action: "restart",
					pointId: p.id,
					lessonRun: 1,
					requestId: randomUUID(),
				})
			).status,
			409,
		);

		const refill = await learner();
		await db.$executeRaw`UPDATE "RpgWallet" SET bits=500 WHERE "userId"=${refill.id}`;
		for (const itemId of ["life-drop", "life-potion", "life-elixir"]) {
			const bought = await post(refill, {
				action: "buy",
				itemId,
				requestId: randomUUID(),
			});
			assert.equal(bought.status, 200, JSON.stringify(bought));
		}
		let cursor = 0;
		const reach = async (key) => {
			while (rows[cursor].key !== key) {
				const e = rows[cursor++];
				const r = await submit(refill, e);
				assert.equal(r.status, 200, JSON.stringify(r));
			}
		};
		const use = (itemId, e, requestId = randomUUID()) =>
			post(refill, {
				action: "use",
				itemId,
				pointId: p.id,
				entryKey: e.key,
				round: 1,
				requestId,
			});
		await reach(graded[0].key);
		const full = await use("life-drop", graded[0]);
		assert.equal(full.status, 422);
		assert.match(full.error, /5 vidas/);
		await submit(refill, rows[cursor], wrong(rows[cursor]));
		cursor++;
		await reach(graded[1].key);
		const uuid = randomUUID();
		const restored = await Promise.all([
			use("life-drop", graded[1], uuid),
			use("life-drop", graded[1], uuid),
		]);
		assert.ok(restored.every((r) => r.status === 200 && r.result.lives === 5));
		const [stock] =
			await db.$queryRaw`SELECT quantity FROM "InventoryItem" WHERE "userId"=${refill.id} AND "itemId"='life-drop'`;
		assert.equal(stock.quantity, 0);
		const assistance =
			await db.$queryRaw`SELECT assisted FROM "RpgQuestionState" WHERE "userId"=${refill.id} AND "pointId"=${p.id} AND "entryKey"=${graded[1].key}`;
		assert.equal(assistance.length, 0);
		await submit(refill, rows[cursor], wrong(rows[cursor]));
		cursor++;
		await reach(graded[2].key);
		assert.equal((await use("life-potion", graded[2])).result.lives, 5);
		for (let i = 2; i <= 5; i++) {
			await reach(graded[i].key);
			const r = await submit(refill, rows[cursor], wrong(rows[cursor]));
			cursor++;
			assert.equal(r.status, 200);
		}
		assert.equal((await progress(refill, p.id)).lives, 1);
		await reach(graded[6].key);
		const elixir = await use("life-elixir", graded[6]);
		assert.equal(elixir.status, 200);
		assert.equal(elixir.result.lives, 5);
		await submit(refill, rows[cursor], wrong(rows[cursor]));
		cursor++;
		await reach(graded[7].key);
		const empty = await use("life-drop", graded[7]);
		assert.equal(empty.status, 422);
		assert.equal((await progress(refill, p.id)).lives, 4);
		const [usage] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "ItemUsage" WHERE "userId"=${refill.id} AND "itemId"='life-drop' AND action='use'`;
		assert.equal(usage.count, 1);
		console.log(
			"Conferidos: quinto erro, repetição concorrente, bloqueio, histórico, recomeço idempotente, envio antigo, revisão sem perda, três reposições, limite de cinco e estoque sem consumo duplicado.",
		);
	} finally {
		for (const id of students)
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
