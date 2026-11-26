import assert from "node:assert/strict";
import { test } from "node:test";
import {
	examScore,
	getExamDefinition,
	unitOneExam,
} from "../src/server/me-exam-bank.mjs";

const text = (unit, number) => {
	const q = getExamDefinition(unit).questions[number - 1];
	return q.choices.find((c) => c.id === q.answer).text;
};
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} ≠ ${b}`);
const multiply = (a, b) =>
	a.map((row) =>
		b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)),
	);
const identity = (n) =>
	Array.from({ length: n }, (_, i) =>
		Array.from({ length: n }, (_, j) => Number(i === j)),
	);
const poly = (coefficients, x) =>
	coefficients.reduce((sum, c) => sum * x + c, 0);

test("as três provas têm 20 questões válidas e identificação independente", () => {
	const ids = new Set();
	for (const unit of [1, 2, 3]) {
		const { questions, version } = getExamDefinition(unit);
		assert.equal(questions.length, 20);
		assert.equal(version, unit === 1 ? 2 : 1);
		for (const q of questions) {
			assert.ok(q.id.startsWith(`u${unit}-`));
			assert.ok(!ids.has(q.id));
			ids.add(q.id);
			assert.equal(new Set(q.choices.map((c) => c.text.trim())).size, 4);
			assert.equal(new Set(q.choices.map((c) => c.id)).size, 4);
			assert.equal(q.choices.filter((c) => c.id === q.answer).length, 1);
			assert.ok(q.explanation.trim().length > 0);
		}
		const answers = Object.fromEntries(questions.map((q) => [q.id, q.answer]));
		assert.equal(examScore(questions, answers), 20);
		assert.equal(examScore(questions, {}), 0);
		answers[questions[0].id] = "invalida";
		assert.equal(examScore(questions, answers), 19);
	}
	assert.deepEqual(getExamDefinition(1).questions, unitOneExam);
	for (const word of [
		"coeficientes",
		"Operações",
		"notáveis",
		"Fatoração",
		"multiplicidades",
		"Divisão",
		"resto",
		"Ruffini",
		"racionais",
		"Reconstrução",
		"Pares",
		"Relações",
		"Domínio",
		"imagem",
		"sobrejetividade",
		"Composição",
		"inversa",
		"afim",
		"Parábola",
		"Vértice",
	])
		assert.ok(
			getExamDefinition(2).questions.some((q) =>
				q.topic.toLowerCase().includes(word.toLowerCase()),
			),
			word,
		);
	for (const word of [
		"Simetria",
		"partes",
		"Periodicidade",
		"exponencial",
		"logarítmica",
		"multiplicativo",
		"triângulo",
		"Radianos",
		"Ciclo",
		"recíprocas",
		"Identidades",
		"Adição",
		"Gráfico",
		"Equação",
		"Dimensões",
		"transposta",
		"Produto",
		"invertibilidade",
		"Inversa 2",
		"inversa 3",
	])
		assert.ok(
			getExamDefinition(3).questions.some((q) =>
				q.topic.toLowerCase().includes(word.toLowerCase()),
			),
			word,
		);
});

test("gabaritos de polinômios e funções conferem por substituição e reconstrução", () => {
	assert.equal(text(2, 1), "3 e 0");
	assert.equal(text(2, 2), "x²−3x+4");
	assert.equal(text(2, 3), "4x²−12x+9");
	assert.equal(text(2, 4), "x+3, para x≠3");
	assert.equal(text(2, 5), "2 dupla e −1 simples");
	assert.equal(text(2, 6), "(x²−x+3, 2)");
	assert.equal(Number(text(2, 7).replace("−", "-")), (6 - 2 ** 3) / 2);
	assert.equal(text(2, 8), "2x²+x−6 e 0");
	assert.equal(text(2, 9), "±1, ±2, ±3, ±4, ±6, ±12, ±1/2, ±3/2");
	const divisors = (n) =>
		Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
	const candidates = new Set(
		divisors(12).flatMap((p) => divisors(2).flatMap((q) => [p / q, -p / q])),
	);
	assert.deepEqual(
		[...candidates].sort((a, b) => a - b),
		[-12, -6, -4, -3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4, 6, 12],
	);
	assert.equal(text(2, 10), "2x²−4x−6");
	for (const x of [-4, -1, 0, 1, 2, 3, 5]) {
		close(2 * x * x - x + 3 - (x * x + 2 * x - 1), x * x - 3 * x + 4);
		close((2 * x - 3) ** 2, 4 * x * x - 12 * x + 9);
		close(poly([1, -2, 4, -1], x), (x - 1) * poly([1, -1, 3], x) + 2);
		close(poly([2, -3, -8, 12], x), (x - 2) * poly([2, 1, -6], x));
		close(2 * (x + 1) * (x - 3), poly([2, -4, -6], x));
		if (x !== 3) close((x * x - 9) / (x - 3), x + 3);
	}
	close(poly([2, -4, -6], -1), 0);
	close(poly([2, -4, -6], 3), 0);
	close(poly([2, -4, -6], 0), -6);
	assert.equal(text(2, 11), "(3,−2)");
	close(2 * 3 - 1, 5);
	close(-2 + 3, 1);
	assert.equal(text(2, 12), "{(1,a),(2,a),(3,b)}");
	assert.equal(text(2, 13), "[1,∞)∖{3}");
	assert.equal(text(2, 14), "ℝ e {0,1}");
	assert.deepEqual([...new Set([-1, 0, 1].map((x) => x * x))].sort(), [0, 1]);
	assert.equal(text(2, 15), "Sobrejetora e não injetora");
	assert.equal(text(2, 16), "√(x−2), x≥2");
	assert.equal(text(2, 17), "(x+5)/3");
	assert.equal(text(2, 18), "f(x)=2x+1");
	assert.equal(text(2, 19), "(1,3)");
	assert.equal(text(2, 20), "Máximo 4 em x=3");
	for (const x of [-3, 0, 1, 2, 3, 6]) {
		close((3 * x - 5 + 5) / 3, x);
		assert.equal(x * x - 4 * x + 3 < 0, x > 1 && x < 3);
		close(-x * x + 6 * x - 5, 4 - (x - 3) ** 2);
	}
	close((7 - 3) / (3 - 1), 2);
	close(2 * 1 + 1, 3);
	close(2 * 3 + 1, 7);
});

test("gabaritos trigonométricos e matriciais conferem numericamente e por produtos", () => {
	assert.equal(text(3, 1), "f:ℝ→ℝ, f(x)=x³−x");
	for (const x of [-3, -1, 0, 2]) close((-x) ** 3 - -x, -(x ** 3 - x));
	assert.equal(text(3, 2), "(1,0)");
	const piece = (x) => (x < 1 ? x + 2 : x * x);
	assert.deepEqual([piece(1), piece(-2)], [1, 0]);
	assert.equal(text(3, 3), "2π/3");
	for (const x of [0.1, 0.7, 2])
		close(Math.sin(3 * (x + (2 * Math.PI) / 3)), Math.sin(3 * x));
	assert.equal(text(3, 4), "É decrescente e sua imagem é (0,∞)");
	assert.ok(0.5 ** -2 > 0.5 ** 0 && 0.5 ** 0 > 0.5 ** 3 && 0.5 ** 100 > 0);
	assert.equal(text(3, 5), "Domínio (3,∞) e ponto (4,0)");
	close(Math.log2(4 - 3), 0);
	assert.equal(text(3, 6), "9 horas");
	close(80 * 2 ** (9 / 3), 640);
	assert.equal(text(3, 7), "3/5");
	close(3 / Math.hypot(3, 4), 3 / 5);
	assert.equal(text(3, 8), "3/2");
	close(4 * (3 / 2), 6);
	assert.equal(text(3, 9), "(−√3/2,1/2)");
	close(Math.cos((5 * Math.PI) / 6), -Math.sqrt(3) / 2);
	close(Math.sin((5 * Math.PI) / 6), 0.5);
	assert.equal(text(3, 10), "(2,√3/3)");
	close(1 / Math.cos(Math.PI / 3), 2);
	close(1 / Math.tan(Math.PI / 3), Math.sqrt(3) / 3);
	assert.equal(text(3, 11), "sen x, para sen x≠0");
	for (const x of [0.2, 1, 2.3])
		close((1 - Math.cos(x) ** 2) / Math.sin(x), Math.sin(x));
	assert.equal(text(3, 12), "(√6+√2)/4");
	close(Math.sin(Math.PI / 4 + Math.PI / 6), (Math.sqrt(6) + Math.sqrt(2)) / 4);
	assert.equal(text(3, 13), "Amplitude 2, período π, imagem [−3,1]");
	close(2 * Math.cos(0) - 1, 1);
	close(2 * Math.cos(Math.PI) - 1, -3);
	assert.equal(text(3, 14), "{π/6,5π/6}");
	for (const x of [Math.PI / 6, (5 * Math.PI) / 6]) close(Math.sin(x), 0.5);
	assert.equal(text(3, 15), "Somente AB, com dimensão 2×4");
	const a = [
		[1, 2],
		[3, 4],
	];
	assert.deepEqual(
		JSON.parse(text(3, 16)),
		a.map((row, i) => row.map((value, j) => 2 * value - a[j][i])),
	);
	assert.deepEqual(
		JSON.parse(text(3, 17)),
		multiply(
			[
				[1, 2],
				[0, 1],
			],
			[
				[2, 0],
				[3, 4],
			],
		),
	);
	assert.equal(text(3, 18), "Todo k real diferente de 6");
	for (const k of [-2, 0, 6, 9]) assert.equal(k * 1 - 2 * 3 !== 0, k !== 6);
	const inverse = JSON.parse(text(3, 19).replaceAll("−", "-"));
	assert.deepEqual(
		multiply(
			[
				[2, 1],
				[1, 1],
			],
			inverse,
		),
		identity(2),
	);
	assert.deepEqual(
		multiply(inverse, [
			[2, 1],
			[1, 1],
		]),
		identity(2),
	);
	const last = text(3, 20);
	assert.ok(last.startsWith("det(A)=1;"));
	const inverse3 = JSON.parse(
		last.slice(last.indexOf("[[")).replaceAll("−", "-"),
	);
	const triangular = [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 1],
	];
	assert.deepEqual(multiply(triangular, inverse3), identity(3));
	assert.deepEqual(multiply(inverse3, triangular), identity(3));
});
