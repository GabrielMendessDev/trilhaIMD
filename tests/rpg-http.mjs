import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { dayAt, dayIndex, items, studyDay } from "../src/domain/rpg.ts";

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
const students = [];
async function learner(bits = 0, initialize = true) {
	const id = `teste-rpg-${randomUUID()}`,
		token = randomUUID();
	students.push(id);
	await db.$executeRaw`INSERT INTO "User"(id,name) VALUES (${id},'Teste RPG')`;
	await db.$executeRaw`INSERT INTO "Session"(id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
	const u = { id, cookie: `authjs.session-token=${token}` };
	if (initialize) await state(u);
	if (bits) {
		await db.$executeRaw`UPDATE "RpgWallet" SET bits=${bits} WHERE "userId"=${id}`;
		await db.$executeRaw`INSERT INTO "CurrencyTransaction"("userId",key,kind,subject,bits,xp,"balanceAfter") VALUES (${id},'test-fixture','fixture','Temporary test funding',${bits},0,${bits})`;
	}
	return u;
}
async function state(u) {
	const r = await fetch(`${origin}/api/rpg`, { headers: { cookie: u.cookie } });
	assert.equal(r.status, 200, await r.clone().text());
	return r.json();
}
async function post(u, body) {
	const r = await fetch(`${origin}/api/rpg`, {
		method: "POST",
		headers: { cookie: u.cookie, origin, "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	return { status: r.status, ...(await r.json()) };
}
const action = (u, action, itemId, more = {}) =>
	post(u, { action, itemId, requestId: randomUUID(), ...more });
async function lesson() {
	const [point] =
		await db.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=1`;
	const rows =
		await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer,e.payload,e.content FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId" WHERE a."pointId"=${point.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
	return { pointId: point.id, rows };
}
async function answer(
	u,
	entry,
	round = 1,
	value = entry.answer,
	variant = "",
	number = 1,
) {
	const form = new FormData();
	form.set("item", entry.key);
	form.set("rodada", String(round));
	form.set("variant", variant);
	if (entry.type === "WALKTHROUGH") form.set("resposta", "concluido");
	else if (typeof value === "string") form.set("resposta", value);
	else
		for (const { origem, destino } of value ?? [])
			form.set(`resposta:${origem}`, destino);
	const r = await fetch(`${origin}/aprender/elementar/${number}/responder`, {
		method: "POST",
		headers: { cookie: u.cookie, origin },
		body: form,
	});
	return { status: r.status, ...(await r.json()) };
}
async function reach(u, rows, key) {
	for (const row of rows) {
		if (row.key === key) return;
		const r = await answer(u, row);
		assert.equal(r.status, 200, JSON.stringify(r));
	}
}
async function bag(u, pointId, entryKey) {
	const r = await fetch(
		`${origin}/api/rpg?pointId=${pointId}&entryKey=${entryKey}&round=1`,
		{ headers: { cookie: u.cookie } },
	);
	assert.equal(r.status, 200);
	return r.json();
}
const stock = (s, id) => s.inventory.find((i) => i.id === id).quantity;

test("economia, itens, progressão e proteção persistem com transações reais", {
	timeout: 240000,
}, async () => {
	try {
		const { pointId, rows } = await lesson();
		const first = rows.find((r) => r.type === "MULTIPLE_CHOICE"),
			second = rows.filter((r) => r.type === "MULTIPLE_CHOICE")[1];
		assert.ok(first && second);
		const poor = await learner();
		assert.equal((await action(poor, "buy", "hint-scroll")).status, 422);
		assert.equal(stock(await state(poor), "hint-scroll"), 0);
		const concurrent = await learner(40);
		const same = randomUUID();
		const duplicate = await Promise.all([
			action(concurrent, "buy", "hint-scroll", { requestId: same }),
			action(concurrent, "buy", "hint-scroll", { requestId: same }),
		]);
		assert.ok(duplicate.every((r) => r.status === 200));
		assert.equal((await state(concurrent)).bits, 5);
		assert.equal(stock(await state(concurrent), "hint-scroll"), 1);
		const limited = await learner(40);
		const parallel = await Promise.all([
			action(limited, "buy", "hint-scroll"),
			action(limited, "buy", "hint-scroll"),
		]);
		assert.deepEqual(parallel.map((r) => r.status).sort(), [200, 422]);
		assert.equal((await state(limited)).bits, 5);
		const u = await learner(2000);
		for (const i of items) {
			assert.equal((await action(u, "buy", i.id)).status, 200);
		}
		assert.equal((await action(u, "buy", "arcane-frame")).status, 422);
		const equipId = randomUUID();
		assert.equal(
			(
				await action(u, "equip", "arcane-frame", {
					equipped: true,
					requestId: equipId,
				})
			).status,
			200,
		);
		assert.equal(
			(
				await action(u, "equip", "arcane-frame", {
					equipped: false,
					requestId: equipId,
				})
			).status,
			409,
		);
		assert.ok(
			(await state(u)).inventory.find((i) => i.id === "arcane-frame").equipped,
		);
		await reach(u, rows, first.key);
		const context = { pointId, entryKey: first.key, round: 1 };
		const before = await state(u);
		assert.equal(
			(
				await action(u, "use", "hint-scroll", {
					...context,
					entryKey: second.key,
				})
			).status,
			422,
		);
		assert.equal(
			stock(await state(u), "hint-scroll"),
			stock(before, "hint-scroll"),
		);
		const swap = await action(u, "use", "challenge-swap", context);
		assert.equal(swap.status, 200, JSON.stringify(swap));
		assert.ok(swap.result.variant);
		assert.equal(swap.result.model.activity.prompt.includes("api"), true);
		const hintId = randomUUID();
		const hint = await action(u, "use", "hint-scroll", {
			...context,
			requestId: hintId,
		});
		assert.equal(hint.status, 200, JSON.stringify(hint));
		assert.ok(hint.result.hint);
		assert.equal(
			(await action(u, "use", "hint-scroll", { ...context, requestId: hintId }))
				.status,
			200,
		);
		assert.equal(stock(await state(u), "hint-scroll"), 0);
		const example = await action(u, "use", "example-scroll", context);
		assert.equal(example.status, 200, JSON.stringify(example));
		assert.ok(example.result.example);
		const lens = await action(u, "use", "answer-lens", context);
		assert.equal(lens.status, 200, JSON.stringify(lens));
		assert.ok(lens.result.removed.length);
		assert.ok(!lens.result.removed.includes("extra-1"));
		assert.equal((await action(u, "use", "answer-lens", context)).status, 422);
		const restored = await bag(u, pointId, first.key);
		assert.equal(restored.variant, swap.result.variant);
		assert.deepEqual(restored.removed, lens.result.removed);
		assert.equal((await answer(u, first, 1, first.answer)).status, 422);
		assert.equal(
			(await answer(u, first, 1, "extra-1", swap.result.variant)).status,
			200,
		);
		const s = await state(u);
		assert.equal(s.stats.correct, 0);
		assert.equal(s.stats.combo, 0);
		const nextIndex = rows.findIndex((r) => r.key === first.key) + 1;
		for (const row of rows.slice(nextIndex)) {
			if (row.key === second.key) break;
			assert.equal((await answer(u, row)).status, 200);
		}
		const defer = await action(u, "use", "tactical-delay", {
			pointId,
			entryKey: second.key,
			round: 1,
		});
		assert.equal(defer.status, 200, JSON.stringify(defer));
		assert.ok(defer.result.destination);
		assert.equal(
			(
				await action(u, "use", "tactical-delay", {
					pointId,
					entryKey: second.key,
					round: 1,
				})
			).status,
			422,
		);
		const later = rows.slice(rows.findIndex((r) => r.key === second.key) + 1);
		let skipped;
		for (const row of later) {
			if (!skipped && row.type === "MULTIPLE_CHOICE") {
				const use = { pointId, entryKey: row.key, round: 1 };
				assert.equal(
					(await action(u, "use", "question-pass", use)).status,
					422,
				);
				assert.equal(
					(await action(u, "use", "question-pass", { ...use, confirmed: true }))
						.status,
					200,
				);
				skipped = row.key;
				continue;
			}
			assert.equal((await answer(u, row)).status, 200);
		}
		assert.equal((await answer(u, second)).status, 200);
		const [saved] =
			await db.$queryRaw`SELECT xp,"skippedEntries",attempts,"completedAt" FROM "LearningPointProgress" WHERE "userId"=${u.id} AND "pointId"=${pointId}`;
		assert.ok(saved.completedAt);
		assert.ok(saved.skippedEntries.includes(skipped));
		assert.equal(saved.attempts[skipped], undefined);
		assert.equal((await state(u)).stats.perfect, 0);
		const balance = (await state(u)).bits;
		assert.equal((await answer(u, second)).status, 200);
		assert.equal((await state(u)).bits, balance);
		const perfect = await learner();
		for (const row of rows)
			assert.equal((await answer(perfect, row)).status, 200);
		const ps = await state(perfect);
		assert.equal(ps.stats.perfect, 1);
		assert.ok(ps.achievements.find((a) => a.id === "perfect-1").unlockedAt);
		assert.ok(ps.achievements.find((a) => a.id === "bestCombo-3").unlockedAt);
		assert.ok(ps.achievements.find((a) => a.id === "correct-10").unlockedAt);
		assert.ok(ps.achievements.find((a) => a.id === "lessons-1").unlockedAt);
		assert.ok(
			ps.achievements.find((a) => a.id === "bestStudyStreak-1").unlockedAt,
		);
		assert.ok(ps.bits >= 35);
		const revision = await learner();
		for (const row of rows) {
			const wrong =
				row.key === first.key
					? row.payload.alternativas.find((a) => a.id !== row.answer).id
					: row.answer;
			assert.equal((await answer(revision, row, 1, wrong)).status, 200);
		}
		assert.equal((await answer(revision, first, 2)).status, 200);
		const rs = await state(revision);
		assert.equal(rs.stats.reviews, 1);
		assert.equal(rs.stats.recovered, 1);
		assert.ok(rs.achievements.find((a) => a.id === "reviews-1").unlockedAt);
		assert.equal((await answer(revision, first, 2, "invalid")).status, 422);
		assert.equal(
			(
				await post(revision, {
					action: "use",
					itemId: "hint-scroll",
					requestId: randomUUID(),
					pointId,
					entryKey: first.key,
					round: 3,
				})
			).status,
			400,
		);
		const material = rows.find((r) => r.content?.categoria === "material");
		assert.ok(material);
		const m = await post(perfect, {
			action: "material",
			pointId,
			entryKey: material.key,
		});
		assert.equal(m.status, 200);
		assert.equal((await state(perfect)).stats.materials, 0);
		assert.equal(
			(
				await post(perfect, {
					action: "material",
					pointId,
					entryKey: material.key,
					answer: "extra-1",
				})
			).status,
			422,
		);
		await db.$executeRaw`UPDATE "MaterialReading" SET "startedAt"=now()-interval '20 seconds' WHERE "userId"=${perfect.id}`;
		await db.$executeRaw`UPDATE "RpgWallet" SET stats=jsonb_set(stats,'{materials}','4'::jsonb) WHERE "userId"=${perfect.id}`;
		assert.equal(
			(
				await post(perfect, {
					action: "material",
					pointId,
					entryKey: material.key,
					answer: "bad",
				})
			).status,
			422,
		);
		assert.equal(
			(
				await post(perfect, {
					action: "material",
					pointId,
					entryKey: material.key,
					answer: "extra-1",
				})
			).status,
			200,
		);
		assert.ok(
			(await state(perfect)).achievements.find((a) => a.id === "materials-5")
				.unlockedAt,
		);
		assert.equal(
			(
				await post(perfect, {
					action: "material",
					pointId,
					entryKey: material.key,
					answer: "extra-1",
				})
			).status,
			200,
		);
		assert.equal((await state(perfect)).stats.materials, 5);
		const shield = await learner(300);
		await action(shield, "buy", "streak-shield");
		assert.equal((await action(shield, "arm", "streak-shield")).status, 422);
		const today = studyDay(new Date());
		await db.$executeRaw`INSERT INTO "StudyDay"("userId",day) VALUES (${shield.id},${today})`;
		assert.equal((await action(shield, "arm", "streak-shield")).status, 200);
		assert.equal(stock(await state(shield), "streak-shield"), 0);
		await db.$executeRaw`UPDATE "StudyDay" SET day=${dayAt(dayIndex(today) - 2)} WHERE "userId"=${shield.id}`;
		await db.$executeRaw`UPDATE "UserStreakProtection" SET "activatedDay"=${dayAt(dayIndex(today) - 2)} WHERE "userId"=${shield.id}`;
		const protectedState = await state(shield);
		assert.equal(protectedState.protections[0].state, "used");
		assert.equal(protectedState.stats.studyStreak, 1);
		assert.equal(protectedState.stats.bestStudyStreak, 0);
		const [days] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "StudyDay" WHERE "userId"=${shield.id}`;
		assert.equal(days.count, 1);
		// Known prerequisite completions are fixtures only; the final checkpoint runs through the real API.
		const explorer = await learner(1000);
		await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedAt",xp) SELECT ${explorer.id},id,now()-interval '1 hour',10 FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number<10`;
		const [finalPoint] =
			await db.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=10`;
		const finalEntries =
			await db.$queryRaw`SELECT a.id::text||'-'||e.number::text AS key,e.type,e.answer FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id=e."activityId" WHERE a."pointId"=${finalPoint.id} ORDER BY a.id,COALESCE(e.position,e.number),e.number`;
		const checkpointQuestions = finalEntries.filter((entry) => entry.answer);
		const finalVerification = checkpointQuestions.at(-1);
		let practiceChecked = false;
		let checkpointChecked = false;
		for (const entry of finalEntries) {
			if (!practiceChecked && entry.answer) {
				await action(explorer, "buy", "challenge-swap");
				await action(explorer, "buy", "challenge-swap");
				const context = {
					pointId: finalPoint.id,
					entryKey: entry.key,
					round: 1,
				};
				const available = await bag(explorer, finalPoint.id, entry.key);
				assert.equal(
					available.inventory.find((i) => i.id === "question-pass").reason,
					null,
				);
				assert.equal(
					available.inventory.find((i) => i.id === "challenge-swap").reason,
					null,
				);
				const changed = await action(
					explorer,
					"use",
					"challenge-swap",
					context,
				);
				assert.equal(changed.status, 200, JSON.stringify(changed));
				assert.ok(changed.result.variant);
				await action(explorer, "buy", "question-pass");
				await action(explorer, "buy", "question-pass");
				assert.equal(
					(await action(explorer, "use", "question-pass", context)).status,
					422,
				);
				assert.equal(stock(await state(explorer), "question-pass"), 2);
				const skippedPractice = await action(explorer, "use", "question-pass", {
					...context,
					confirmed: true,
				});
				assert.equal(
					skippedPractice.status,
					200,
					JSON.stringify(skippedPractice),
				);
				assert.equal(stock(await state(explorer), "question-pass"), 1);
				practiceChecked = true;
				continue;
			}
			if (entry.key === finalVerification.key) {
				assert.equal(
					(
						await action(explorer, "use", "question-pass", {
							pointId: finalPoint.id,
							entryKey: entry.key,
							round: 1,
							confirmed: true,
						})
					).status,
					422,
				);
				assert.equal(stock(await state(explorer), "question-pass"), 1);
				const refusedSwap = await action(explorer, "use", "challenge-swap", {
					pointId: finalPoint.id,
					entryKey: entry.key,
					round: 1,
				});
				assert.equal(refusedSwap.status, 422);
				assert.match(refusedSwap.error, /questão essencial/);
				assert.equal(stock(await state(explorer), "challenge-swap"), 1);
				checkpointChecked = true;
			}
			const result = await answer(explorer, entry, 1, entry.answer, "", 10);
			assert.equal(result.status, 200, JSON.stringify(result));
		}
		assert.ok(practiceChecked && checkpointChecked);
		const explored = await state(explorer);
		assert.equal(explored.stats.trails, 1);
		assert.equal(explored.stats.disciplines, 1);
		assert.ok(
			explored.achievements.find((a) => a.id === "trails-1").unlockedAt,
		);
		assert.ok(
			explored.achievements.find((a) => a.id === "disciplines-1").unlockedAt,
		);
		// Import of an existing completion preserves its original XP and runs once.
		const historical = await learner(0, false);
		const historicalAttempts = Object.fromEntries(
			rows
				.filter((r) => r.answer)
				.map((r) => [
					r.key,
					[
						{
							correct: true,
							selection:
								typeof r.answer === "string"
									? [r.answer]
									: r.answer.map((a) => a.destino),
						},
					],
				]),
		);
		await db.$executeRaw`INSERT INTO "LearningPointProgress"("userId","pointId","completedEntries",attempts,"completedAt",xp) VALUES (${historical.id},${pointId},${rows.map((r) => r.key)}::text[],${JSON.stringify(historicalAttempts)}::jsonb,now()-interval '1 day',10)`;
		const imported = await state(historical),
			importedAgain = await state(historical);
		assert.equal(imported.xp, importedAgain.xp);
		assert.equal(imported.bits, importedAgain.bits);
		assert.ok(imported.xp > 10);
		const [legacy] =
			await db.$queryRaw`SELECT xp FROM "LearningPointProgress" WHERE "userId"=${historical.id}`;
		assert.equal(legacy.xp, 10);
		const [totals] =
			await db.$queryRaw`SELECT count(*)::int AS count,count(DISTINCT key)::int AS unique FROM "CurrencyTransaction" WHERE "userId"=${u.id}`;
		assert.equal(totals.count, totals.unique);
		const [negative] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "RpgWallet" WHERE "userId"=ANY(${students}::text[]) AND bits<0`;
		assert.equal(negative.count, 0);
	} finally {
		for (const id of students)
			await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
