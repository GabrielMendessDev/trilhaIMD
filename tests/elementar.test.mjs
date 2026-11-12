import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { pointSchema } from "../scripts/esquema-conteudo.mjs";
import {
	stageChallenge,
	trails,
	trailUnit,
} from "../src/app/aprender/trails.ts";

const course = Array.from({ length: 60 }, (_, i) =>
	pointSchema.parse(
		JSON.parse(
			readFileSync(
				new URL(
					`../conteudos/elementar/${String(i + 1).padStart(2, "0")}.json`,
					import.meta.url,
				),
				"utf8",
			),
		),
	),
);
const question = (n, index) =>
	course[n - 1].atividades[0].questoes.filter(
		(e) => e.questao?.tipo === "multipla-escolha",
	)[index - 1].questao;
const answer = (n, index) => {
	const q = question(n, index);
	return q.alternativas.find((a) => a.id === q.gabarito).texto;
};

test("as três unidades têm vinte passos reescritos, sem lacunas, com 17 telas e dez questões reais cada", () => {
	let graded = 0,
		screens = 0,
		examples = 0;
	for (const [i, f] of course.entries()) {
		assert.equal(f.ponto, i + 1);
		assert.equal(f.trilha, "elementar");
		assert.equal(f.atividades.length, 1);
		const a = f.atividades[0];
		assert.equal(a.id, `elementar-v2-passo-${String(i + 1).padStart(2, "0")}`);
		assert.equal(a.questoes.length, 17);
		screens += a.questoes.length;
		const qs = a.questoes.filter((e) => e.questao?.tipo === "multipla-escolha");
		graded += qs.length;
		assert.equal(qs.length, 10);
		assert.equal(new Set(qs.map((e) => e.questao.enunciado)).size, 10);
		assert.equal(a.questoes.filter((e) => e.modo === "conteudo").length, 6);
		assert.deepEqual(
			a.questoes.map((e) => e.numero),
			Array.from({ length: 17 }, (_, i) => i + 1),
		);
		assert.equal(
			a.questoes.filter((e) => e.conteudo?.categoria === "material").length,
			1,
		);
		for (const { questao: q } of qs) {
			assert.equal(
				new Set(q.alternativas.map((a) => a.texto)).size,
				q.alternativas.length,
			);
			assert.ok(q.explicacao.length > 0);
			assert.notEqual(
				q.explicacao,
				q.alternativas.find((a) => a.id === q.gabarito).texto,
			);
			assert.ok(q.orientacao);
		}
		const walkthrough = a.questoes.filter(
			(e) => e.questao?.tipo === "passo-a-passo",
		);
		examples += walkthrough.length;
		assert.equal(walkthrough[0].questao.passos.length, 3);
	}
	assert.deepEqual(
		{ screens, graded, examples },
		{ screens: 1020, graded: 600, examples: 60 },
	);
	for (const u of [1, 2, 3])
		assert.equal(
			course.filter((f) => Math.ceil(f.ponto / 20) === u).length,
			20,
		);
});

test("o mapa e as fronteiras de unidade permitem acesso até o passo sessenta", () => {
	assert.equal(trails.find((t) => t.id === "elementar").positions.length, 60);
	for (const [n, u] of [
		[1, 1],
		[20, 1],
		[21, 2],
		[40, 2],
		[41, 3],
		[60, 3],
	])
		assert.equal(trailUnit("elementar", n), u);
	assert.equal(stageChallenge(10, "elementar"), undefined);
	assert.equal(stageChallenge(20, "elementar"), "Missão da unidade");
	assert.equal(trails.find((t) => t.id === "calculo").positions.length, 10);
});

test("todas as figuras existem localmente, têm descrição e não dependem de conexão", () => {
	let count = 0;
	for (const file of course)
		for (const e of file.atividades[0].questoes)
			for (const b of e.conteudo?.blocos ?? []) {
				if (b.tipo !== "imagem") continue;
				count++;
				assert.ok(b.alt.length > 50);
				assert.ok(existsSync(new URL(`../public${b.src}`, import.meta.url)));
				const svg = readFileSync(
					new URL(`../public${b.src}`, import.meta.url),
					"utf8",
				);
				assert.ok(svg.includes("<title"));
				assert.ok(!svg.includes("NaN"));
			}
	assert.ok(count >= 25);
});

test("o leitor e a apostila contêm o material integral e cada solução comentada", () => {
	const html = readFileSync(
		new URL("../public/materiais/elementar/index.html", import.meta.url),
		"utf8",
	);
	const embedded = JSON.parse(
		html.match(
			/<script id="course-data" type="application\/json">([\s\S]*?)<\/script>/,
		)[1],
	);
	assert.deepEqual(embedded, course);
	assert.ok(!/<script[^>]+src=/.test(html));
	const md = readFileSync(
		new URL("../conteudos/elementar/APOSTILA-COMPLETA.md", import.meta.url),
		"utf8",
	);
	assert.equal((md.match(/^## Passo /gm) || []).length, 60);
	assert.equal((md.match(/^### Tela /gm) || []).length, 1020);
	assert.equal(
		(md.match(/Resposta comentada — consulte depois de tentar/g) || []).length,
		600,
	);
});

test("gabaritos numéricos são conferidos por cálculos independentes", () => {
	const checks = [
		[2, 6, 1 / 8, "1/8"],
		[5, 1, 18 + 15 - 6, "27"],
		[5, 2, 40 - 27, "13"],
		[5, 4, 2 ** 4, "16"],
		[5, 5, 2 ** 4 - 1, "15"],
		[5, 6, 2 ** 3 - 2, "6"],
		[7, 1, 2 ** 3, "8"],
		[7, 3, 7 ** 0, "1"],
		[7, 4, 2 ** -3, "1/8"],
		[8, 1, 2 ** 3 * 2 ** 4, "128"],
		[8, 2, 3 ** 5 / 3 ** 2, "27"],
		[8, 3, (2 ** 3) ** 2, "64"],
		[8, 4, 5 ** -2, "1/25"],
		[8, 5, 27 ** (2 / 3), "9"],
		[9, 2, Math.log(25) / Math.log(5), "2"],
		[9, 3, Math.log2(1 / 8), "−3"],
		[9, 8, Math.log(4) / Math.log(0.5), "−2"],
		[9, 10, 4 ** 3, "64"],
		[10, 1, Math.log2(32), "5"],
		[10, 2, Math.log(1 / 9) / Math.log(3), "−2"],
		[10, 4, Math.log2(8 * 4), "5"],
		[10, 5, Math.log2(8 / 4), "1"],
		[14, 1, 36 / 4, "9"],
		[14, 3, (-3) ** 2 - 4 * 2 * 1, "1"],
		[20, 2, 2 ** 5 - 1, "31"],
		[20, 3, 8 ** (2 / 3) * 2 ** -1, "2"],
		[20, 4, Math.log(Math.E ** 2) + Math.log(27) / Math.log(3), "5"],
		[21, 6, (-1) ** 2 - 3 * -1 + 2, "6"],
		[23, 5, 99 ** 2, "9801"],
		[25, 9, 2 * (-1) ** 2 * 3, "6"],
		[26, 4, 2 ** 3 - 2 * 2 + 4, "8"],
		[27, 10, 3 - 1 + 2, "4"],
		[30, 2, 2 * -1 * -3, "6"],
		[31, 1, 2 * 3, "6"],
		[37, 5, (9 - 5) / (3 - 1), "2"],
		[39, 2, 2 ** 2 - 4 * 2 + 1, "−3"],
		[39, 5, -(3 ** 2) + 6 * 3 + 7, "16"],
		[39, 8, (2 - 5) ** 2, "9"],
		[46, 2, 50 * 2 ** 3, "400"],
		[46, 7, 80 * (1 / 2) ** 3, "10"],
		[47, 5, Math.hypot(5, 12), "13"],
		[48, 9, 6 / 3, "2"],
		[51, 9, 1 + 2 ** 2, "5"],
		[51, 10, 1 + 3 ** 2, "10"],
		[58, 1, 2 * 4 - 1 * 3, "5"],
		[58, 2, 1 * 4 - 2 * 2, "0"],
		[58, 3, 1 * 4 - -2 * 3, "10"],
		[58, 4, 1 * 3 * 1 + 2 * 1 * 2, "7"],
		[58, 5, 1 * 3 * 1, "3"],
		[58, 6, 2 * 1 * 2, "4"],
	];
	const fractions = { "1/8": 0.125, "1/25": 0.04 };
	for (const [n, q, value, label] of checks) {
		assert.equal(answer(n, q), label, `Passo ${n}, questão ${q}`);
		assert.ok(
			Math.abs(value - (fractions[label] ?? Number(label.replace("−", "-")))) <
				1e-10,
			`Cálculo do passo ${n}, questão ${q}`,
		);
	}
});

const product = (a, b) =>
	a.map((row) =>
		b[0].map((_, j) => row.reduce((sum, x, k) => sum + x * b[k][j], 0)),
	);
test("as inversas 2×2 e 3×3 dos exemplos produzem identidade nos dois sentidos", () => {
	for (const [a, b] of [
		[
			[
				[2, 1],
				[1, 1],
			],
			[
				[1, -1],
				[-1, 2],
			],
		],
		[
			[
				[1, 1, 0],
				[0, 1, 1],
				[0, 0, 1],
			],
			[
				[1, -1, 1],
				[0, 1, -1],
				[0, 0, 1],
			],
		],
		[
			[
				[1, 0],
				[2, 1],
			],
			[
				[1, 0],
				[-2, 1],
			],
		],
	]) {
		const identity = a.map((_, i) => a.map((_, j) => Number(i === j)));
		assert.deepEqual(product(a, b), identity);
		assert.deepEqual(product(b, a), identity);
	}
	assert.equal(answer(59, 2), "[[1,−1],[−1,2]]");
	assert.equal(answer(59, 8), "(−1,1,0)ᵀ");
	assert.equal(answer(59, 9), "(1,−1,1)ᵀ");
});

test("intervalos de sinais e raízes biquadradas são verificados na expressão original", () => {
	const solution = (x) => x < -3 || (x > 1 && x <= 2) || x >= 4;
	for (const x of [-10, -3, -2, 0, 1, 1.5, 2, 3, 4, 10]) {
		const defined = x !== -3 && x !== 1;
		assert.equal(
			defined && ((x - 2) * (x - 4)) / ((x + 3) * (x - 1)) >= 0,
			solution(x),
		);
	}
	assert.equal(answer(19, 9), "(−∞,−1)∪{2}");
	for (const x of [-2, -1, 1, 2]) assert.equal(x ** 4 - 5 * x * x + 4, 0);
	for (const x of [-3, -1, 1, 3]) assert.equal(x ** 4 - 10 * x * x + 9, 0);
	assert.ok(
		Math.abs(Math.sin(Math.PI / 12) - (Math.sqrt(6) - Math.sqrt(2)) / 4) <
			1e-12,
	);
	assert.ok(
		Math.abs(Math.tan((5 * Math.PI) / 12) - (2 + Math.sqrt(3))) < 1e-12,
	);
	assert.equal(answer(52, 3), "(√6−√2)/4");
	assert.equal(answer(52, 9), "2+√3");
});
