import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Exercise the real server functions with a database boundary double. No Next
// server or real student database is needed to enforce query-count regressions.
const root = new URL("../", import.meta.url);
const db = {
	queries: [],
	transactions: 0,
	read: () => [],
	async $queryRaw(parts, ...values) {
		const sql = parts.join("?");
		this.queries.push({ sql, values });
		return this.read(sql, values);
	},
	async $executeRaw() {
		throw new Error("Unexpected write on settled read");
	},
	async $transaction() {
		this.transactions++;
		throw new Error("Unexpected transaction on settled read");
	},
};
globalThis[Symbol.for("trilbit.read-model-db")] = db;
const cacheEntries = new Map();
globalThis[Symbol.for("trilbit.read-model-cache")] = cacheEntries;
const hooks = registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "server-only")
			return { url: "data:text/javascript,export{}", shortCircuit: true };
		if (specifier === "next/cache")
			return {
				url: `data:text/javascript,${encodeURIComponent(`
				export function unstable_cache(read, keys) {
					return async () => {
						const cache = globalThis[Symbol.for('trilbit.read-model-cache')];
						const key = JSON.stringify(keys);
						if (!cache.has(key)) cache.set(key, read());
						return cache.get(key);
					};
				}`)}`,
				shortCircuit: true,
			};
		const isDb =
			specifier === "~/server/db" ||
			(specifier === "./db" && context.parentURL?.includes("/src/server/"));
		if (isDb)
			return {
				url: `data:text/javascript,export const db=globalThis[Symbol.for('trilbit.read-model-db')];`,
				shortCircuit: true,
			};
		if (specifier.startsWith("~/") || specifier.startsWith(".")) {
			const base = specifier.startsWith("~/")
				? new URL(`src/${specifier.slice(2)}`, root)
				: new URL(specifier, context.parentURL);
			for (const extension of [".ts", ".tsx", ".mjs"])
				if (existsSync(fileURLToPath(base) + extension))
					return nextResolve(
						pathToFileURL(fileURLToPath(base) + extension).href,
						context,
					);
		}
		return nextResolve(specifier, context);
	},
});
const { studyDay, emptyStats } = await import("../src/domain/rpg.ts");
const { getStudyInsights, getDailyMissions } = await import(
	"../src/server/study-insights.ts"
);
const { getPublishedPoints } = await import("../src/server/learning.ts");
const { readRpgSummary, readRpgBalance } = await import("../src/server/rpg.ts");
hooks.deregister();

beforeEach(() => {
	db.queries = [];
	db.transactions = 0;
	cacheEntries.clear();
});

function settled() {
	return {
		initialized: true,
		settledDay: studyDay(new Date()),
		rewardedLevel: 1,
	};
}

test("60 studied lessons use one metadata query and preserve review ordering and scores", async () => {
	const points = Array.from({ length: 60 }, (_, i) => ({
		id: i + 1,
		trail: "elementar",
		number: i + 1,
		reward: 10,
		title: `Lição ${i + 1}`,
	}));
	const rows = points.map((p) => ({
		pointId: p.id,
		attempts: { [`${p.id}-1`]: [{ correct: true }] },
		completedEntries: [],
		skippedEntries: [],
		deferredEntries: [],
		completedAt: null,
		xp: 0,
		correctAnswers: 0,
	}));
	rows[0].attempts["1-1"] = [{ correct: false }];
	rows[1].attempts["2-1"] = [{ correct: false }, { correct: true }];
	rows[2].attempts["3-1"] = [{ correct: false }, { correct: false }];
	rows[3].attempts = {};
	rows[3].skippedEntries = ["4-1"];
	rows[1].completedAt = new Date("2026-11-15T12:00:00Z");
	db.read = (sql) => {
		if (sql.includes('FROM "LearningCatalogRevision"'))
			return [{ version: "1" }];
		if (sql.includes('SELECT initialized,"settledDay"')) return [settled()];
		if (sql.includes('FROM "RpgEvent"'))
			return [{ answers: 5, lessons: 1, materials: 0, bonus: true }];
		if (sql.includes('FROM "LearningPointProgress" l')) return rows;
		if (sql.includes('FROM "TrailPoint" p JOIN')) return points;
		if (sql.includes('FROM "LearningActivity" a JOIN'))
			return points.map((p) => ({
				pointId: p.id,
				key: `${p.id}-1`,
				topic: "Conjuntos",
			}));
		throw new Error(`Unexpected query: ${sql}`);
	};
	const insights = await getStudyInsights("learner");
	assert.equal(insights.attempted, 59);
	assert.equal(insights.first, 56);
	assert.equal(insights.recovered, 1);
	assert.equal(insights.missed, 1);
	assert.deepEqual(
		insights.review.map((r) => r.kind),
		["pending", "missed", "skipped", "recovered"],
	);
	assert.match(insights.review[3].href, /retorno=2-1&rodada=2$/);
	assert.equal(
		db.queries.filter((q) => q.sql.includes('FROM "LearningActivity" a JOIN'))
			.length,
		1,
	);
	assert.ok(
		db.queries.every((q) => !/e\.answer|e\.content|SELECT blocks/.test(q.sql)),
	);
	assert.equal(db.transactions, 0);
});

test("daily missions avoid catalog, progress and lesson reads", async () => {
	db.read = (sql) => {
		if (sql.includes('SELECT initialized,"settledDay"')) return [settled()];
		if (sql.includes('FROM "RpgEvent"'))
			return [{ answers: 7, lessons: 2, materials: 1, bonus: true }];
		throw new Error(`Unexpected query: ${sql}`);
	};
	const daily = await getDailyMissions("learner");
	assert.equal(daily.answers, 7);
	assert.equal(daily.lessons, 2);
	assert.equal(db.queries.length, 2);
	assert.equal(db.transactions, 0);
});

test("RPG summary has no histories and initialized balances need one read without awards", async () => {
	db.read = (sql) => {
		if (sql.includes('SELECT initialized,"settledDay"')) return [settled()];
		if (sql.includes("SELECT w.*"))
			return [
				{
					...settled(),
					bits: 40,
					xp: 120,
					achievementXp: 10,
					stats: emptyStats(),
					protected: false,
				},
			];
		if (/FROM "(InventoryItem|UserAchievement|AchievementProgress)"/.test(sql))
			return [];
		throw new Error(`Unexpected query: ${sql}`);
	};
	const summary = await readRpgSummary("learner");
	assert.equal(summary.bits, 40);
	assert.equal(summary.xp, 120);
	assert.equal(summary.achievements.length, 41);
	assert.equal(summary.inventory.length, 13);
	assert.equal(db.queries.length, 5);
	assert.ok(!("history" in summary));
	db.queries = [];
	assert.equal((await readRpgBalance("learner")).xp, 120);
	assert.equal(db.queries.length, 1);
	assert.equal(db.transactions, 0);
});

test("published cache reuses metadata and refreshes immediately when publication revision changes", async () => {
	let revision = "1";
	let title = "Before publication";
	db.read = (sql) => {
		if (sql.includes('FROM "LearningCatalogRevision"'))
			return [{ version: revision }];
		if (sql.includes('FROM "TrailPoint" p JOIN'))
			return [{ id: 1, trail: "elementar", number: 1, title }];
		throw new Error(`Unexpected query: ${sql}`);
	};
	assert.equal((await getPublishedPoints())[0].title, title);
	await getPublishedPoints();
	assert.equal(
		db.queries.filter((q) => q.sql.includes('FROM "TrailPoint" p JOIN')).length,
		1,
	);
	title = "After publication";
	revision = "2";
	assert.equal((await getPublishedPoints())[0].title, title);
	assert.equal(
		db.queries.filter((q) => q.sql.includes('FROM "TrailPoint" p JOIN')).length,
		2,
	);
});
