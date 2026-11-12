import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { PrismaClient } from "../generated/prisma/index.js";

process.loadEnvFile();
assert.ok(
	["localhost", "127.0.0.1"].includes(
		new URL(process.env.DATABASE_URL).hostname,
	),
);
const mode = process.argv[2];
assert.ok(["antes", "depois"].includes(mode));
const db = new PrismaClient(),
	directory = new URL("../conteudos/elementar/backups/", import.meta.url),
	snapshot = new URL("estado-principal-antes-v2.json", directory);
try {
	const slug = mode === "antes" ? "elementar" : "elementar-v1-20261112";
	const [progress] =
		await db.$queryRaw`SELECT count(*)::int AS count,COALESCE(sum(l.xp),0)::int AS xp,md5(COALESCE(string_agg(concat_ws(';',l."userId",l."pointId",l."completedEntries"::text,l.attempts::text,l."skippedEntries"::text,l."deferredEntries"::text,l."completedAt"::text,l.xp,l."correctAnswers"),chr(10) ORDER BY l."userId",l."pointId"),'')) AS fingerprint FROM "LearningPointProgress" l JOIN "TrailPoint" p ON p.id=l."pointId" WHERE p."trailSlug"=${slug}`;
	const [wallet] =
		await db.$queryRaw`SELECT count(*)::int AS count,COALESCE(sum(bits),0)::int AS bits,COALESCE(sum("achievementXp"),0)::int AS xp,md5(COALESCE(string_agg(concat_ws(';',"userId",bits,"achievementXp"),chr(10) ORDER BY "userId"),'')) AS fingerprint FROM "RpgWallet"`;
	if (mode === "antes") {
		await mkdir(directory, { recursive: true });
		await writeFile(snapshot, JSON.stringify({ progress, wallet }, null, 2));
		console.log(
			`Registrados ${progress.count} progressos e os totais das carteiras para conferência de integridade.`,
		);
	} else {
		const before = JSON.parse(await readFile(snapshot, "utf8"));
		assert.deepEqual(
			progress,
			before.progress,
			"Os registros históricos de progresso precisam permanecer idênticos.",
		);
		assert.deepEqual(
			wallet,
			before.wallet,
			"Bits e XP das carteiras precisam permanecer idênticos.",
		);
		const [published] =
			await db.$queryRaw`SELECT count(DISTINCT p.id)::int AS points,count(*)::int AS screens,count(*) FILTER(WHERE e.type='MULTIPLE_CHOICE')::int AS questions FROM "TrailPoint" p JOIN "LearningActivity" a ON a."pointId"=p.id JOIN "LearningEntry" e ON e."activityId"=a.id WHERE p."trailSlug"='elementar'`;
		assert.deepEqual(published, { points: 60, screens: 1020, questions: 600 });
		const [stock] =
			await db.$queryRaw`SELECT count(*)::int AS count FROM "ShopItem" WHERE id IN ('life-drop','life-potion','life-elixir')`;
		assert.equal(stock.count, 3);
		console.log(
			JSON.stringify({
				published,
				lifeItems: stock.count,
				preservedProgress: progress.count,
				integrity: "Histórico, XP e Bits preservados",
			}),
		);
	}
} finally {
	await db.$disconnect();
}
