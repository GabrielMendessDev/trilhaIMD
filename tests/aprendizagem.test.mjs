import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { pointSchema } from "../scripts/esquema-conteudo.mjs";
import {
	advanceLesson,
	lessonProgressPercent,
	lessonScore,
	pendingItem,
} from "../src/server/lesson-progress.ts";

const items = [
	{ key: "intro", graded: false, topic: "Introdução" },
	{ key: "q1", graded: true, topic: "Pertinência" },
	{ key: "material", graded: false, topic: "Material" },
	{ key: "q2", graded: true, topic: "Inclusão" },
	{ key: "q3", graded: true, topic: "Operações" },
];
const empty = () => ({ completedEntries: [], attempts: {} });
const correct = { correct: true, selection: ["a"] };
const wrong = { correct: false, selection: ["b"] };
function answer(progress, key, round, attempt) {
	const updated = advanceLesson(items, progress, { key, round }, attempt);
	assert.ok(updated);
	return updated;
}

test("a rodada inicial continua após um erro e inclui as telas de estudo", () => {
	let progress = answer(empty(), "intro", 1);
	progress = answer(progress, "q1", 1, wrong);
	assert.deepEqual(progress.attempts.q1, [wrong]);
	assert.deepEqual(pendingItem(items, progress), { key: "material", round: 1 });
	assert.equal(
		advanceLesson(items, progress, { key: "q1", round: 1 }, correct),
		undefined,
	);
	assert.equal(
		advanceLesson(items, progress, { key: "q1", round: 2 }, correct),
		undefined,
	);
	progress = answer(progress, "material", 1);
	assert.deepEqual(pendingItem(items, progress), { key: "q2", round: 1 });
});

test("só as questões erradas voltam, com uma tentativa adicional após restaurar a sessão", () => {
	let progress = answer(empty(), "intro", 1);
	progress = answer(progress, "q1", 1, wrong);
	progress = answer(progress, "material", 1);
	progress = answer(progress, "q2", 1, correct);
	progress = answer(progress, "q3", 1, wrong);
	assert.equal(lessonProgressPercent(items, progress, 1), 100);
	assert.equal(lessonProgressPercent(items, progress, 2), 0);
	progress = JSON.parse(JSON.stringify(progress));
	assert.deepEqual(pendingItem(items, progress), { key: "q1", round: 2 });
	assert.equal(
		advanceLesson(items, progress, { key: "q3", round: 2 }, correct),
		undefined,
	);
	progress = answer(progress, "q1", 2, correct);
	assert.equal(lessonProgressPercent(items, progress, 2), 50);
	assert.deepEqual(pendingItem(items, progress), { key: "q3", round: 2 });
	progress = answer(progress, "q3", 2, wrong);
	assert.equal(lessonProgressPercent(items, progress, 2), 100);
	assert.equal(pendingItem(items, progress), undefined);
	assert.equal(
		advanceLesson(items, progress, { key: "q3", round: 2 }, correct),
		undefined,
	);
	assert.deepEqual(lessonScore(items, progress), {
		total: 3,
		first: 1,
		recovered: 1,
		missed: 1,
		legacy: 0,
		points: 1.5,
		topics: ["Pertinência", "Operações"],
	});
});

test("uma primeira rodada perfeita termina sem revisão e teoria não altera a nota", () => {
	let progress = empty();
	for (const { key, graded } of items)
		progress = answer(progress, key, 1, graded ? correct : undefined);
	assert.equal(pendingItem(items, progress), undefined);
	assert.deepEqual(lessonScore(items, progress), {
		total: 3,
		first: 3,
		recovered: 0,
		missed: 0,
		legacy: 0,
		points: 3,
		topics: [],
	});
});

test("progresso anterior conserva a conclusão sem atribuir rodada a um acerto antigo", () => {
	const progress = { completedEntries: ["intro", "q1"], attempts: {} };
	assert.deepEqual(pendingItem(items, progress), { key: "material", round: 1 });
	assert.equal(lessonScore(items, progress).legacy, 1);
	assert.equal(lessonScore(items, progress).first, 0);
});

test("o fluxo rejeita avanço fora de ordem e conclusão de questão sem resposta", () => {
	assert.equal(
		advanceLesson(items, empty(), { key: "q1", round: 1 }, correct),
		undefined,
	);
	const progress = answer(empty(), "intro", 1);
	assert.equal(
		advanceLesson(items, progress, { key: "q1", round: 1 }),
		undefined,
	);
});

test("os dez primeiros passos reescritos separam ensino, prática e material", () => {
	for (let number = 1; number <= 10; number++) {
		const name = String(number).padStart(2, "0");
		const file = new URL(
			`../conteudos/elementar/${name}.json`,
			import.meta.url,
		);
		const [activity] = pointSchema.parse(
			JSON.parse(readFileSync(file, "utf8")),
		).atividades;
		const sequence = activity.questoes;
		const graded = sequence.filter(({ questao }) => questao?.gabarito);
		assert.ok(graded.length >= 10);
		assert.deepEqual(
			sequence.filter(({ numero }) => numero <= 12).map(({ numero }) => numero),
			Array.from({ length: 12 }, (_, index) => index + 1),
		);
		assert.deepEqual(
			sequence.map(({ ordem }) => ordem),
			Array.from({ length: sequence.length }, (_, index) => index + 1),
		);
		assert.ok(
			sequence.some(({ conteudo }) => conteudo?.categoria === "material"),
		);
		assert.ok(
			sequence.some(({ questao }) => questao?.tipo === "passo-a-passo"),
		);
		assert.equal(sequence[0].modo, "conteudo");
		assert.ok(
			graded.every(
				({ questao }) =>
					questao.orientacao && questao.explicacao && questao.assunto,
			),
		);
		assert.ok(
			sequence.some(
				(item, index) =>
					item.modo === "conteudo" && index > 0 && index < sequence.length - 1,
			),
		);
	}
});
