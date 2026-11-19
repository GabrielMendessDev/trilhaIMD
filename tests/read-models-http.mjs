import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";
import { dayAt, dayIndex, emptyStats, studyDay } from "../src/domain/rpg.ts";

assert.equal(
	process.env.TRILBIT_DISPOSABLE_TEST,
	"1",
	"Use the disposable integration runner.",
);
const origin = process.env.TRILBIT_TEST_URL;
assert.equal(new URL(origin).hostname, "127.0.0.1");
assert.equal(new URL(process.env.DATABASE_URL).hostname, "127.0.0.1");
const db = new PrismaClient();

test("read models preserve settlement, avoid read locks, invalidate published cache and use event index", {
	timeout: 120000,
}, async () => {
	const id = `teste-read-model-${randomUUID()}`;
	const token = randomUUID();
	const cookie = `authjs.session-token=${token}`;
	const today = studyDay(new Date());
	let activity;
	let originalTitle;
	const get = async (path) => {
		const response = await fetch(origin + path, { headers: { cookie } });
		assert.equal(response.status, 200, await response.clone().text());
		return response;
	};
	try {
		await db.$executeRaw`INSERT INTO "User" (id,name) VALUES (${id},'Read model test')`;
		await db.$executeRaw`INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES (${randomUUID()},${token},${id},timezone('UTC',now()+interval '1 hour'))`;
		await db.$executeRaw`INSERT INTO "RpgWallet" ("userId",initialized,"settledDay",stats) VALUES (${id},true,${today},${JSON.stringify(emptyStats())}::jsonb)`;
		await get("/api/rpg");
		// A settled GET must finish even while another connection holds the wallet lock.
		await db.$transaction(
			async (tx) => {
				await tx.$queryRaw`SELECT "userId" FROM "RpgWallet" WHERE "userId"=${id} FOR UPDATE`;
				const response = await fetch(origin + "/api/rpg", {
					headers: { cookie },
					signal: AbortSignal.timeout(5000),
				});
				assert.equal(response.status, 200);
			},
			{ timeout: 10000 },
		);

		const yesterday = dayAt(dayIndex(today) - 1);
		const beforeYesterday = dayAt(dayIndex(today) - 2);
		await db.$executeRaw`INSERT INTO "StudyDay" ("userId",day) VALUES (${id},${beforeYesterday})`;
		await db.$executeRaw`INSERT INTO "UserStreakProtection" ("userId","activatedDay") VALUES (${id},${yesterday})`;
		await db.$executeRaw`UPDATE "RpgWallet" SET "settledDay"=${yesterday} WHERE "userId"=${id}`;
		const state = await (await get("/api/rpg")).json();
		// Protection bridges the gap without counting it as another studied day.
		assert.equal(state.stats.studyStreak, 1);
		assert.equal(state.protections[0].state, "used");
		await get("/api/rpg");
		const [settled] =
			await db.$queryRaw`SELECT "settledDay",(SELECT count(*)::int FROM "ItemUsage" WHERE "userId"=${id} AND action='protect') AS uses FROM "RpgWallet" WHERE "userId"=${id}`;
		assert.equal(settled.settledDay, today);
		assert.equal(settled.uses, 1);

		[activity] =
			await db.$queryRaw`SELECT a.id,a.title FROM "LearningActivity" a JOIN "TrailPoint" p ON p.id=a."pointId" WHERE p."trailSlug"='elementar' AND p.number=1 ORDER BY a.id LIMIT 1`;
		originalTitle = activity.title;
		const [before] =
			await db.$queryRaw`SELECT version FROM "LearningCatalogRevision" WHERE id=1`;
		await assert.rejects(
			db.$transaction(async (tx) => {
				await tx.$executeRaw`UPDATE "LearningActivity" SET title='rolled back title' WHERE id=${activity.id}`;
				throw new Error("rollback publication");
			}),
			/rollback publication/,
		);
		const [rolledBack] =
			await db.$queryRaw`SELECT version FROM "LearningCatalogRevision" WHERE id=1`;
		assert.equal(rolledBack.version, before.version);
		await get("/");
		const title = `Updated-${randomUUID()}`;
		await db.$executeRaw`UPDATE "LearningActivity" SET title=${title} WHERE id=${activity.id}`;
		assert.ok(
			(await (await get("/")).text()).includes(title),
			"New publication must bypass cached catalog immediately",
		);
		const [published] =
			await db.$queryRaw`SELECT version FROM "LearningCatalogRevision" WHERE id=1`;
		assert.ok(published.version > before.version);

		// Representative selective day-range lookup: older history should stay out of the scan.
		await db.$executeRaw`INSERT INTO "RpgEvent" ("userId",key,type,payload,"createdAt") SELECT ${id},'history:'||n,'answer','{}'::jsonb,now()-interval '10 days' FROM generate_series(1,20000) n`;
		await db.$executeRaw`ANALYZE "RpgEvent"`;
		const plan =
			await db.$queryRaw`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT count(*) FROM "RpgEvent" WHERE "userId"=${id} AND "createdAt">=now()-interval '1 day'`;
		assert.match(JSON.stringify(plan), /RpgEvent_userId_createdAt_idx/);
		console.log("Selective event query uses RpgEvent_userId_createdAt_idx.");
		const owners = `${id}-history-`;
		try {
			await db.$executeRaw`INSERT INTO "User" (id) SELECT ${owners}||n FROM generate_series(1,40) n`;
			await db.$executeRaw`INSERT INTO "CurrencyTransaction" ("userId",key,kind,subject,bits,xp,"balanceAfter") SELECT ${owners}||u,n::text,'test','test',0,0,0 FROM generate_series(1,40) u CROSS JOIN generate_series(1,500) n`;
			await db.$executeRaw`INSERT INTO "ItemUsage" ("userId","requestId","itemId",action,result) SELECT ${owners}||u,n::text,'test','test','{}'::jsonb FROM generate_series(1,40) u CROSS JOIN generate_series(1,500) n`;
			await db.$executeRaw`ANALYZE "CurrencyTransaction"`;
			await db.$executeRaw`ANALYZE "ItemUsage"`;
			const owner = `${owners}1`;
			const currencyPlan =
				await db.$queryRaw`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id,kind,bits FROM "CurrencyTransaction" WHERE "userId"=${owner} ORDER BY id DESC LIMIT 50`;
			const usagePlan =
				await db.$queryRaw`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id,action,result FROM "ItemUsage" WHERE "userId"=${owner} ORDER BY id DESC LIMIT 30`;
			const indexes =
				await db.$queryRaw`SELECT indexname FROM pg_indexes WHERE indexname IN ('CurrencyTransaction_userId_id_idx','ItemUsage_userId_id_idx')`;
			assert.equal(indexes.length, 2);
			const currency = currencyPlan[0]["QUERY PLAN"][0].Plan;
			const usage = usagePlan[0]["QUERY PLAN"][0].Plan;
			assert.equal(currency["Actual Rows"], 50);
			assert.equal(usage["Actual Rows"], 30);
			// Planner choices depend on data distribution and page costs; do not force
			// an index merely to make the regression test green.
			console.log(
				"History plans (40 users / 20,000 rows each):",
				JSON.stringify({
					currency: currency.Plans[0]["Index Name"],
					usage: usage.Plans[0]["Index Name"],
				}),
			);
		} finally {
			await db.$executeRaw`DELETE FROM "User" WHERE id LIKE ${`${owners}%`}`;
		}
	} finally {
		if (activity && originalTitle !== undefined)
			await db.$executeRaw`UPDATE "LearningActivity" SET title=${originalTitle} WHERE id=${activity.id}`;
		await db.$executeRaw`DELETE FROM "User" WHERE id=${id}`;
		await db.$disconnect();
	}
});
