import assert from "node:assert/strict";
import { test } from "node:test";
import {
	lifeItems,
	MAX_LIVES,
	remainingLives,
	restoredLives,
} from "../src/domain/lesson-lives.mjs";
import { items as shop } from "../src/domain/rpg.ts";
import { advanceLesson, pendingItem } from "../src/server/lesson-progress.ts";

const items = Array.from({ length: 10 }, (_, i) => ({
	key: `q${i + 1}`,
	graded: true,
	topic: "Teste",
}));
const empty = () => ({ completedEntries: [], attempts: {}, lives: 5, run: 1 });
test("cinco erros normais esgotam vidas e bloqueiam qualquer avanço", () => {
	let state = empty();
	for (let i = 0; i < 5; i++) {
		const current = pendingItem(items, state);
		assert.equal(current.key, `q${i + 1}`);
		state = advanceLesson(items, state, current, {
			correct: false,
			selection: ["errada"],
		});
		assert.equal(state.lives, 4 - i);
	}
	assert.equal(pendingItem(items, state), undefined);
	assert.equal(
		advanceLesson(
			items,
			state,
			{ key: "q6", round: 1 },
			{ correct: true, selection: ["a"] },
		),
		undefined,
	);
});
test("acertos, leitura e todos os erros da revisão preservam vidas", () => {
	const withReading = [
		{ key: "leitura", graded: false, topic: "Estudo" },
		...items,
	];
	let state = advanceLesson(withReading, empty(), { key: "leitura", round: 1 });
	assert.equal(state.lives, 5);
	for (const [i, q] of items.entries())
		state = advanceLesson(
			withReading,
			state,
			{ key: q.key, round: 1 },
			{ correct: i !== 0, selection: ["a"] },
		);
	assert.equal(state.lives, 4);
	assert.equal(pendingItem(withReading, state).round, 2);
	state = advanceLesson(
		withReading,
		state,
		{ key: "q1", round: 2 },
		{ correct: false, selection: ["b"] },
	);
	assert.equal(state.lives, 4);
	assert.equal(pendingItem(withReading, state), undefined);
	assert.equal(remainingLives(1, false, 2), 1);
});
test("repetir a mesma submissão não desconta uma segunda vida", () => {
	const state = advanceLesson(
		items,
		empty(),
		{ key: "q1", round: 1 },
		{ correct: false, selection: ["b"] },
	);
	assert.equal(state.lives, 4);
	assert.equal(
		advanceLesson(
			items,
			state,
			{ key: "q1", round: 1 },
			{ correct: false, selection: ["b"] },
		),
		undefined,
	);
	assert.equal(state.lives, 4);
});
test("os três consumíveis repõem 1, 3 e até 5 vidas sem ultrapassar o máximo", () => {
	assert.equal(MAX_LIVES, 5);
	assert.equal(restoredLives(2, lifeItems["life-drop"]), 3);
	assert.equal(restoredLives(1, lifeItems["life-potion"]), 4);
	assert.equal(restoredLives(4, lifeItems["life-potion"]), 5);
	assert.equal(restoredLives(1, lifeItems["life-elixir"]), 5);
	for (const id of Object.keys(lifeItems)) {
		const item = shop.find((i) => i.id === id);
		assert.equal(item.kind, "consumable");
		assert.ok(item.price > 0);
	}
});
