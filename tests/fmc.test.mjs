import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import unit1 from "../scripts/autoria/fmc/unidade-1.mjs";
import unit2 from "../scripts/autoria/fmc/unidade-2.mjs";
import unit3 from "../scripts/autoria/fmc/unidade-3.mjs";
import {
	stageChallenge,
	trails,
	trailUnit,
} from "../src/app/aprender/trails.ts";
import { examScore, getExamDefinition } from "../src/server/me-exam-bank.mjs";

const lessons = [...unit1, ...unit2, ...unit3];
const json = (p) =>
	JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const manifest = json("../conteudos/fmc/manifesto.json");
const files = lessons.map((l) =>
	json(`../conteudos/fmc/${String(l.n).padStart(2, "0")}.json`),
);
const answer = (n, i) => lessons[n - 1].quiz[i - 1][1];
const number = (n, i) =>
	Number(
		answer(n, i)
			.replaceAll("−", "-")
			.match(/-?\d+(?:[,.]\d+)?/)[0]
			.replace(",", "."),
	);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const factorial = (n) => (n < 2 ? 1 : n * factorial(n - 1));
const choose = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));
const mod = (a, m) => ((a % m) + m) % m;
const powmod = (a, n, m) => {
	let r = 1;
	for (let i = 0; i < n; i++) r = (r * a) % m;
	return r;
};
test("FMC tem três unidades de seis módulos, 306 telas e 180 exercícios com fontes e comentários", () => {
	assert.deepEqual(
		manifest.unidades.map((u) => [u.inicio, u.fim]),
		[
			[1, 6],
			[7, 12],
			[13, 18],
		],
	);
	assert.deepEqual(manifest.totais, {
		passos: 18,
		telas: 306,
		questoes: 180,
		exemplos: 18,
	});
	for (const [i, file] of files.entries()) {
		assert.equal(file.trilha, "fmc");
		assert.equal(file.ponto, i + 1);
		const entries = file.atividades[0].questoes;
		assert.equal(entries.length, 17);
		assert.deepEqual(
			entries.map((e) => e.numero),
			Array.from({ length: 17 }, (_, j) => j + 1),
		);
		assert.equal(entries.filter((e) => e.conteudo).length, 6);
		const example = entries.find((e) => e.questao?.tipo === "passo-a-passo");
		assert.equal(example.questao.passos.length, 3);
		const graded = entries.filter((e) => e.questao?.gabarito);
		assert.equal(graded.length, 10);
		for (const [j, { questao: q }] of graded.entries()) {
			assert.equal(new Set(q.alternativas.map((a) => a.texto)).size, 3);
			assert.equal(
				q.alternativas.find((a) => a.id === q.gabarito).texto,
				lessons[i].quiz[j][1],
			);
			assert.ok(q.explicacao.trim().length > 0);
			assert.equal(q.essencial, j === 9);
		}
		assert.ok(lessons[i].source.includes("Rosen"));
	}
	assert.equal(trails.find((t) => t.id === "fmc").positions.length, 18);
	for (const [point, unit] of [
		[1, 1],
		[6, 1],
		[7, 2],
		[12, 2],
		[13, 3],
		[18, 3],
	])
		assert.equal(trailUnit("fmc", point), unit);
	for (const point of [6, 12, 18])
		assert.equal(stageChallenge(point, "fmc"), "Missão da unidade");
	assert.equal(stageChallenge(5, "fmc"), undefined);
	assert.equal(trailUnit("elementar", 40), 2);
});
test("bases, sinal, frações e exemplos IEEE são conferidos por cálculos independentes", () => {
	for (const [n, q, expected] of [
		[2, 1, 0b1011],
		[2, 3, 0x2a],
		[2, 5, 2 ** 4],
		[2, 6, 0o17],
		[2, 9, 2 ** 4 - 1],
		[3, 3, 0b1111 - 2 ** 4],
		[3, 5, 1 / 2 + 1 / 8],
		[3, 8, 2 ** 4],
		[3, 10, 2 ** (128 - 127)],
		[6, 2, factorial(4)],
		[6, 4, 2 * 3 ** 3],
		[6, 9, 0b10100010],
	])
		assert.equal(number(n, q), expected);
	assert.equal(answer(2, 2), `${(13).toString(2)}₂.`);
	assert.equal(answer(3, 4), `${(256 - 5).toString(2)}.`);
	assert.equal(answer(2, 8), "F₁₆.");
	const bytes = new ArrayBuffer(4),
		view = new DataView(bytes);
	view.setUint32(0, 128 << 23);
	assert.equal(view.getFloat32(0), 2);
	view.setUint32(0, (1 << 31) | (129 << 23));
	assert.equal(view.getFloat32(0), -4);
	for (let n = 0; n <= 255; n++) assert.equal(parseInt(n.toString(2), 2), n);
});
test("divisões negativas, Euclides, inversos e potências modulares são conferidos na condição original", () => {
	assert.equal(number(7, 3), mod(-17, 5));
	assert.equal(number(7, 6), Math.floor(-1 / 4));
	assert.equal(number(8, 1), gcd(48, 18));
	assert.equal(number(8, 2), (12 * 18) / gcd(12, 18));
	assert.equal(number(8, 8), 240 / 4);
	assert.equal(5 * 105 - 2 * 252, gcd(252, 105));
	assert.equal(number(9, 7), (2 + 1) * (1 + 1));
	assert.equal(number(10, 2), mod(-8, 7));
	assert.equal(number(10, 3), mod(38 + 27, 5));
	assert.equal(number(10, 4), mod(9 * 8, 7));
	assert.equal(number(10, 5), powmod(2, 10, 7));
	assert.equal(number(10, 9), powmod(7, 20, 5));
	assert.equal(mod(3 * number(11, 1), 7), 1);
	assert.equal(mod(7 * number(11, 7), 26), 1);
	const solutions = Array.from({ length: 14 }, (_, i) => i).filter(
		(x) => mod(6 * x - 8, 14) === 0,
	);
	assert.deepEqual(solutions, [6, 13]);
	assert.equal(answer(11, 5), "6 e 13.");
	assert.equal(solutions.length, 2);
	assert.equal(answer(11, 4), "Duas.");
	assert.equal(
		Array.from({ length: 6 }, (_, i) => i).some((x) => mod(4 * x - 3, 6) === 0),
		false,
	);
	assert.equal(number(12, 1), mod(19 + 17, 24));
	assert.equal(number(12, 5), powmod(3, 100, 7));
	assert.equal(mod(3 * number(12, 8), 40), 1);
	assert.equal(number(12, 9), powmod(7, 3, 55));
	for (let message = 0; message < 55; message++)
		assert.equal(powmod(powmod(message, 3, 55), 27, 55), message);
});
test("contagem e recorrências são verificadas por enumeração e substituição", () => {
	for (const [n, q, expected] of [
		[13, 1, 3 * 4],
		[13, 3, 2 ** 4],
		[13, 5, 5 ** 2],
		[13, 6, 5 * 4],
		[13, 8, 4 * 4 * 10],
		[13, 9, 4 * 3 * 10],
		[14, 1, factorial(4)],
		[14, 2, 6 * 5 * 4],
		[14, 5, factorial(5) / (factorial(3) * factorial(2))],
		[14, 6, factorial(4) / factorial(2)],
		[15, 1, choose(8, 3)],
		[15, 2, choose(5, 2)],
		[15, 6, choose(5, 2)],
		[15, 8, choose(6, 2)],
		[
			16,
			2,
			Array.from({ length: 30 }, (_, i) => i + 1).filter(
				(n) => n % 2 === 0 || n % 3 === 0,
			).length,
		],
		[16, 5, Math.ceil(10 / 3)],
		[16, 8, 2 ** 4 - 1],
	])
		assert.equal(number(n, q), expected);
	const counts = [1, 2];
	for (let n = 2; n <= 9; n++) counts.push(counts[n - 1] + counts[n - 2]);
	for (let n = 1; n <= 9; n++) {
		const brute = Array.from({ length: 2 ** n }, (_, i) =>
			i.toString(2).padStart(n, "0"),
		).filter((s) => !s.includes("11")).length;
		assert.equal(counts[n], brute);
	}
	assert.equal(number(17, 1), counts[2]);
	assert.equal(number(17, 2), counts[4]);
	assert.equal(number(17, 4), counts[3]);
	const a = [1, 3];
	for (let n = 2; n <= 12; n++) a.push(3 * a[n - 1] - 2 * a[n - 2]);
	for (let n = 0; n < a.length; n++) assert.equal(a[n], 2 ** (n + 1) - 1);
	assert.equal(number(18, 6), a[4]);
	assert.equal(
		number(18, 10),
		[1, 2, 3, 4].reduce((sum, n) => sum + 2 ** n, 0),
	);
});
test("as três provas FMC têm 20 questões e IDs que não colidem com as provas ME", () => {
	const ids = new Set();
	for (const trail of ["elementar", "fmc"])
		for (const unit of [1, 2, 3]) {
			const { questions } = getExamDefinition(unit, trail);
			assert.equal(questions.length, 20);
			for (const q of questions) {
				assert.ok(!ids.has(q.id));
				ids.add(q.id);
				assert.equal(new Set(q.choices.map((c) => c.text)).size, 4);
				assert.ok(q.choices.some((c) => c.id === q.answer));
			}
			assert.equal(
				examScore(
					questions,
					Object.fromEntries(questions.map((q) => [q.id, q.answer])),
				),
				20,
			);
		}
	const correct = (u, n) => {
		const q = getExamDefinition(u, "fmc").questions[n - 1];
		return q.choices.find((c) => c.id === q.answer).text;
	};
	assert.equal(Number(correct(1, 4)), 0b110101);
	assert.equal(Number(correct(1, 8).replace("−", "-")), 0b111010 - 64);
	assert.equal(Number(correct(2, 4)), gcd(126, 84));
	assert.equal(Number(correct(2, 11)), powmod(5, 20, 7));
	assert.equal(correct(2, 16), "4 e 9");
	assert.deepEqual(
		Array.from({ length: 10 }, (_, i) => i).filter(
			(x) => mod(4 * x - 6, 10) === 0,
		),
		[4, 9],
	);
	assert.equal(
		Number(correct(3, 6)),
		factorial(6) / (factorial(3) * factorial(2)),
	);
	assert.equal(Number(correct(3, 7)), choose(9, 3));
	assert.equal(Number(correct(3, 9)), choose(7, 2));
	assert.equal(Number(correct(3, 14)), 13);
	assert.equal(Number(correct(3, 19)), 2 ** 6 - 1);
});
