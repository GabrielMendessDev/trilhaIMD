import assert from "node:assert/strict";
import { test } from "node:test";
import {
	achievements,
	advanceStats,
	emptyStats,
	items,
	levelForXp,
	levelProgress,
	maxLevel,
	rewardsForLevel,
	studyDay,
	studyRuns,
	xpForLevel,
} from "../src/domain/rpg.ts";
import {
	advanceLesson,
	lessonScore,
	pendingItem,
} from "../src/server/lesson-progress.ts";

test("todos os níveis têm limiar de XP, bônus válido e progressão até o teto", () => {
	const ids = new Set(items.map((item) => item.id));
	assert.equal(xpForLevel(1), 0);
	assert.equal(xpForLevel(1000), 99_800_100);
	for (let level = 1; level <= maxLevel; level++) {
		const threshold = xpForLevel(level);
		assert.equal(levelForXp(threshold).level, level);
		assert.ok(rewardsForLevel(level).length > 0);
		assert.ok(rewardsForLevel(level).every((id) => ids.has(id)));
		if (level > 1) assert.equal(levelForXp(threshold - 1).level, level - 1);
	}
	assert.equal(levelProgress(250).remaining, 150);
	assert.equal(levelProgress(250).percent, 50);
	assert.equal(levelForXp(100_000_000).next, null);
	assert.equal(levelProgress(100_000_000).percent, 100);
});

test("41 metas únicas cobrem as sete categorias e os treze itens têm economia separada", () => {
	assert.equal(achievements.length, 41);
	assert.equal(new Set(achievements.map((a) => a.id)).size, 41);
	assert.equal(new Set(achievements.map((a) => a.category)).size, 7);
	assert.equal(items.length, 13);
	assert.equal(new Set(items.map((i) => i.id)).size, 13);
	for (const a of achievements) {
		assert.ok(a.xp > 0 && a.bits > 0);
		assert.ok(a.goal > 0);
		assert.ok(a.description);
		assert.ok(a.symbol);
	}
	assert.equal(items.find((i) => i.id === "hint-scroll").price, 35);
	assert.equal(items.find((i) => i.id === "streak-shield").price, 140);
});
test("todos os patamares de todas as categorias são alcançáveis por eventos", () => {
	let s = emptyStats();
	const reached = new Set();
	const emit = (event) => {
		s = advanceStats(s, event);
		for (const a of achievements) if (s[a.metric] >= a.goal) reached.add(a.id);
	};
	emit({ kind: "study", current: 365, best: 365 });
	for (let i = 0; i < 500; i++)
		emit({ kind: "answer", round: 1, correct: true, assisted: false });
	for (let i = 0; i < 100; i++)
		emit({ kind: "lesson", perfect: true, review: false });
	for (let i = 0; i < 25; i++) {
		emit({ kind: "answer", round: 2, correct: true, assisted: false });
		emit({ kind: "lesson", perfect: false, review: true });
		emit({ kind: "material" });
	}
	emit({ kind: "tracks", count: 3 });
	assert.equal(reached.size, 41);
});
test("erros e ajuda encerram combo; revisão não infla acerto direto ou combo", () => {
	let s = emptyStats();
	for (let i = 0; i < 3; i++)
		s = advanceStats(s, {
			kind: "answer",
			round: 1,
			correct: true,
			assisted: false,
		});
	assert.equal(s.combo, 3);
	s = advanceStats(s, {
		kind: "answer",
		round: 1,
		correct: false,
		assisted: false,
	});
	assert.equal(s.combo, 0);
	assert.equal(s.bestCombo, 3);
	s = advanceStats(s, {
		kind: "answer",
		round: 2,
		correct: true,
		assisted: false,
	});
	assert.equal(s.correct, 3);
	assert.equal(s.recovered, 1);
	assert.equal(s.combo, 0);
	s = advanceStats(s, {
		kind: "answer",
		round: 1,
		correct: true,
		assisted: true,
	});
	assert.equal(s.correct, 3);
	assert.equal(s.combo, 0);
	s = advanceStats(s, { kind: "lesson", perfect: true, review: false });
	s = advanceStats(s, { kind: "lesson", perfect: false, review: false });
	assert.equal(s.perfectRun, 0);
	assert.equal(s.bestPerfectRun, 1);
});
test("calendário usa São Paulo e proteção preserva sem somar dia estudado", () => {
	assert.equal(studyDay(new Date("2026-11-11T01:00:00Z")), "2026-11-10");
	assert.deepEqual(
		studyRuns(["2026-11-01", "2026-11-03"], ["2026-11-02"], "2026-11-03"),
		{ current: 2, best: 2 },
	);
	assert.equal(
		studyRuns(
			["2026-11-01", "2026-11-04"],
			["2026-11-02", "2026-11-03"],
			"2026-11-04",
		).current,
		1,
	);
	assert.equal(
		studyRuns(["2026-11-01"], ["2026-11-02"], "2026-11-04").current,
		0,
	);
	assert.deepEqual(levelForXp(100), { level: 2, start: 100, next: 400 });
});
test("adiar retorna antes da revisão, pular vale zero, e não há terceira tentativa", () => {
	const items = [
		{ key: "a", graded: true, topic: "A" },
		{ key: "b", graded: true, topic: "B" },
		{ key: "c", graded: true, topic: "C" },
	];
	let s = {
		completedEntries: ["b"],
		attempts: { b: [{ correct: false, selection: ["x"] }] },
		deferredEntries: ["a"],
		skippedEntries: [],
	};
	assert.deepEqual(pendingItem(items, s), { key: "c", round: 1 });
	s = { ...s, completedEntries: ["b", "c"], skippedEntries: ["c"] };
	assert.deepEqual(pendingItem(items, s), { key: "a", round: 1 });
	s = advanceLesson(
		items,
		s,
		{ key: "a", round: 1 },
		{ correct: true, selection: ["y"], assisted: true },
	);
	assert.deepEqual(pendingItem(items, s), { key: "b", round: 2 });
	s = advanceLesson(
		items,
		s,
		{ key: "b", round: 2 },
		{ correct: true, selection: ["y"] },
	);
	assert.equal(pendingItem(items, s), undefined);
	assert.equal(lessonScore(items, s).points, 1.5);
	assert.equal(lessonScore(items, s).legacy, 0);
	assert.equal(lessonScore(items, s).missed, 1);
	assert.equal(
		advanceLesson(
			items,
			s,
			{ key: "b", round: 2 },
			{ correct: true, selection: ["y"] },
		),
		undefined,
	);
});
