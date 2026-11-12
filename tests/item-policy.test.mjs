import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { pointSchema } from "../scripts/esquema-conteudo.mjs";
import { isEssentialQuestion } from "../src/domain/question-policy.ts";

const theory = { key: "theory", type: null };
const practice = { key: "practice", type: "MULTIPLE_CHOICE", payload: {} };
const verification = { key: "verification", type: "PAIR_LINKS", payload: {} };
const walkthrough = { key: "walkthrough", type: "WALKTHROUGH" };
const material = { key: "material", type: null };
const lesson = [theory, practice, verification, walkthrough, material];

test("checkpoint protege a verificação final, não todas as questões da lição", () => {
	for (const point of [5, 10]) {
		assert.equal(isEssentialQuestion(practice, point, lesson), false);
		assert.equal(isEssentialQuestion(verification, point, lesson), true);
		assert.equal(isEssentialQuestion(walkthrough, point, lesson), false);
		assert.equal(isEssentialQuestion(material, point, lesson), false);
	}
});

test("questão explicitamente essencial é protegida em qualquer ponto", () => {
	const required = { ...practice, payload: { essencial: true } };
	assert.equal(isEssentialQuestion(required, 1, [required]), true);
	assert.equal(
		isEssentialQuestion({ ...required, type: null }, 1, [required]),
		false,
	);
	assert.equal(
		isEssentialQuestion({ ...required, payload: { essencial: "true" } }, 1, [
			{ ...required, payload: { essencial: "true" } },
		]),
		false,
	);
});

test("pontos de prática não recebem bloqueio por numeração da questão ou ID", () => {
	for (const point of [1, 2, 3, 4, 6, 7, 8, 9])
		for (const entry of lesson)
			assert.equal(isEssentialQuestion(entry, point, lesson), false);
	assert.equal(isEssentialQuestion(verification, 0, lesson), false);
	assert.equal(isEssentialQuestion(practice, 5, [theory, material]), false);
});

test("marcação opcional não libera a verificação final do checkpoint", () => {
	assert.equal(
		isEssentialQuestion(
			{ ...verification, payload: { essencial: false } },
			5,
			lesson,
		),
		true,
	);
});

test("variante não apaga a obrigatoriedade do conteúdo original", () => {
	const original = { ...practice, payload: { essencial: true } };
	assert.equal(
		isEssentialQuestion(practice, 1, [original, verification]),
		true,
	);
});

test("validação do conteúdo preserva a marcação explícita de questão essencial", async () => {
	const point = JSON.parse(
		await readFile(
			new URL("../conteudos/elementar/01.json", import.meta.url),
			"utf8",
		),
	);
	const question = point.atividades[0].questoes.find(
		(e) => e.questao?.tipo === "multipla-escolha",
	);
	question.questao.essencial = true;
	const validated = pointSchema.parse(point);
	assert.equal(
		validated.atividades[0].questoes.find((e) => e.numero === question.numero)
			.questao.essencial,
		true,
	);
});
