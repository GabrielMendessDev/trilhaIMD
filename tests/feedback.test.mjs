import assert from "node:assert/strict";
import { test } from "node:test";
import { consumeFeedbackEvent } from "../src/app/_components/feedback-events.ts";
import {
	earnedAchievements,
	newAchievementsAt,
	summarizeCompletions,
} from "../src/server/learning-metrics.ts";

test("recompensa e desbloqueio celebram uma vez, inclusive após recarregar", () => {
	const records = new Map();
	const storage = () => ({
		getItem: (id) => records.get(id),
		setItem: (id, value) => records.set(id, value),
	});
	assert.equal(consumeFeedbackEvent(storage, "conta1:etapa1:conclusao"), true);
	assert.equal(consumeFeedbackEvent(storage, "conta1:etapa1:conclusao"), false);
	assert.equal(consumeFeedbackEvent(storage, "conta2:etapa1:conclusao"), true);
	assert.equal(consumeFeedbackEvent(storage, "conta1:etapa2:conclusao"), true);
});

test("armazenamento bloqueado desativa efeitos opcionais sem quebrar a tela", () => {
	assert.equal(
		consumeFeedbackEvent(() => {
			throw new Error("Bloqueado");
		}, "event"),
		false,
	);
});

test("somente progresso concluído concede XP e conquistas", () => {
	const progress = summarizeCompletions([
		{ pointId: 1, completedAt: null, xp: 10, correctAnswers: 26 },
	]);
	assert.equal(progress.xp, 0);
	assert.deepEqual(earnedAchievements(progress), []);
});

test("conquistas são calculadas na conclusão que atingiu a condição", () => {
	const rows = [
		{
			pointId: 1,
			completedAt: new Date("2026-11-08T12:00:00Z"),
			xp: 10,
			correctAnswers: 10,
		},
		{
			pointId: 2,
			completedAt: new Date("2026-11-09T12:00:00Z"),
			xp: 10,
			correctAnswers: 15,
		},
		{
			pointId: 3,
			completedAt: new Date("2026-11-10T12:00:00Z"),
			xp: 10,
			correctAnswers: 10,
		},
	];
	assert.deepEqual(
		newAchievementsAt(rows, 1).map(({ id }) => id),
		["first-step"],
	);
	assert.deepEqual(
		newAchievementsAt(rows, 2).map(({ id }) => id),
		["sharp-mind"],
	);
	assert.deepEqual(
		newAchievementsAt(rows, 3).map(({ id }) => id),
		["steady-rhythm"],
	);
	assert.deepEqual(newAchievementsAt(rows, 4), []);
	assert.equal(summarizeCompletions(rows).xp, 30);
});
