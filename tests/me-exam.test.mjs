import assert from "node:assert/strict";

import { test } from "node:test";
import { examScore, unitOneExam } from "../src/server/me-exam-bank.mjs";

test("a prova contém 20 questões com alternativas distintas e cobre os assuntos da Unidade 1 atual", () => {
	assert.equal(unitOneExam.length, 20);
	assert.equal(new Set(unitOneExam.map((q) => q.id)).size, 20);
	for (const q of unitOneExam) {
		assert.equal(new Set(q.choices.map((c) => c.text)).size, 4);
		assert.equal(q.choices.filter((c) => c.id === q.answer).length, 1);
	}
	for (const word of [
		"Conjuntos",
		"Potências",
		"Equações",
		"Inequações",
		"Logaritmos",
	]) {
		assert.ok(
			unitOneExam.some((q) => q.topic.includes(word)),
			word,
		);
	}
	const all = Object.fromEntries(unitOneExam.map((q) => [q.id, q.answer]));
	assert.equal(examScore(unitOneExam, all), 20);
	assert.equal(examScore(unitOneExam, {}), 0);
	all["u1-1"] = "inexistente";
	assert.equal(examScore(unitOneExam, all), 19);
});
