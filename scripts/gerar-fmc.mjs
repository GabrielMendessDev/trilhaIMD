import { mkdir, writeFile } from "node:fs/promises";
import unit1 from "./autoria/fmc/unidade-1.mjs";
import unit2 from "./autoria/fmc/unidade-2.mjs";
import unit3 from "./autoria/fmc/unidade-3.mjs";
import { pointSchema } from "./esquema-conteudo.mjs";
export const lessons = [...unit1, ...unit2, ...unit3];
const directory = new URL("../conteudos/fmc/", import.meta.url);
const publicDirectory = new URL("../public/materiais/fmc/", import.meta.url);
await mkdir(directory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });
const formulas = [
	"p⇒q ⇔ ¬q⇒¬p",
	"n=Σ aᵢbⁱ",
	"−2ⁿ⁻¹ ≤ x ≤ 2ⁿ⁻¹−1",
	"n par ⇔ ∃k∈ℤ, n=2k",
	"P(n₀) e ∀k≥n₀: P(k)⇒P(k+1)",
	"0!=1; (n+1)!=(n+1)n!",
	"n=dq+r, 0≤r<d",
	"mdc(a,b)=mdc(b,a mod b)",
	"n=∏ pᵢ^eᵢ",
	"a≡b (mod m) ⇔ m∣(a−b)",
	"ax≡b tem solução ⇔ mdc(a,m)∣b",
	"a^(p−1)≡1 (mod p), p primo e p∤a",
	"N=n₁n₂⋯nₖ",
	"P(n,r)=n!/(n−r)!",
	"C(n,r)=n!/[r!(n−r)!]",
	"card(A∪B)=card(A)+card(B)−card(A∩B)",
	"aₙ=aₙ₋₁+aₙ₋₂; a₀=1, a₁=2",
	"aₙ=3aₙ₋₁−2aₙ₋₂; a₀=1, a₁=3",
];
const paragraph = (id, texto) => ({ id, tipo: "texto", texto });
const content = (titulo, values, categoria = "explicacao") => ({
	titulo,
	categoria,
	blocos: values.map((value, i) => paragraph(`texto-${i + 1}`, value)),
});
const escapeHtml = (s) =>
	s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
const manifest = {
	versao: 1,
	data: "2026-11-24",
	trilha: "fmc",
	fonte:
		"Rosen, Matemática Discreta e Suas Aplicações, 6ª edição; recorte descrito em FONTES.md",
	unidades: [
		{ unidade: 1, inicio: 1, fim: 6, titulo: "Representar e justificar" },
		{ unidade: 2, inicio: 7, fim: 12, titulo: "Entender os números inteiros" },
		{ unidade: 3, inicio: 13, fim: 18, titulo: "Contar e reconhecer padrões" },
	],
	passos: [],
	totais: { passos: 18, telas: 306, questoes: 180, exemplos: 18 },
};
let html = "";
let markdown =
	"# FMC 1 · Conteúdo de estudo\n\nTexto, exemplos e exercícios autorais baseados no recorte do Rosen descrito em FONTES.md. A divisão em unidades é uma proposta do Trilbit, não o calendário oficial de uma turma.\n\n";
const choicesOf = (l, i) => {
	const texts = l.quiz[i].slice(1, 4);
	return texts.map((_, j) => texts[(j + l.n + i) % texts.length]);
};
const checks = [];
for (const l of lessons) {
	const screens = [];
	const add = (title, values, category) =>
		screens.push({
			modo: "conteudo",
			conteudo: content(title, values, category),
		});
	const quiz = (i) => {
		const [prompt, correct, ...rest] = l.quiz[i];
		const explanation = rest.pop();
		const texts = [correct, ...rest];
		const alternatives = texts.map((_, j) => ({
			id: String.fromCharCode(97 + j),
			texto: texts[(j + l.n + i) % texts.length],
		}));
		screens.push({
			modo: "questao",
			questao: {
				tipo: "multipla-escolha",
				enunciado: prompt,
				alternativas: alternatives,
				gabarito: alternatives.find((a) => a.texto === correct).id,
				assunto: l.title,
				orientacao: `Retome a definição e as condições do problema. ${l.goal}`,
				explicacao: explanation,
				essencial: i === 9,
			},
		});
	};
	add(l.title, [l.hook, `Ao concluir: ${l.goal}`, `Para começar: ${l.prereq}`]);
	add("Dar nome às ideias", [l.concept]);
	screens.at(-1).conteudo.blocos.push({
		id: "formula-central",
		tipo: "formula",
		leitura: l.goal,
		termos: [{ forma: "texto", valor: formulas[l.n - 1] }],
	});
	quiz(0);
	add("Por que isso funciona?", [l.why]);
	quiz(1);
	screens.push({
		modo: "questao",
		questao: {
			tipo: "passo-a-passo",
			enunciado: `Exemplo guiado · ${l.title}`,
			assunto: l.title,
			passos: l.example.map((value, i) => ({
				id: `passo-${i + 1}`,
				titulo: [
					"Organizar as informações",
					"Desenvolver o raciocínio",
					"Concluir e conferir",
				][i],
				blocos: [paragraph(`exemplo-${i + 1}`, value)],
			})),
		},
	});
	quiz(2);
	quiz(3);
	add("O erro que vale investigar", [
		l.trap,
		"Explique por que o argumento falha e teste as condições antes de continuar.",
	]);
	quiz(4);
	quiz(5);
	add("Levar a ideia para outra situação", [l.transfer]);
	quiz(6);
	quiz(7);
	add(
		"Mapa de bolso",
		[
			l.concept,
			`Referência: ${l.source}. Texto e exercícios desta trilha são autorais.`,
			`Recuperação ativa: reconstrua o exemplo sem consultar a solução e justifique cada passo.`,
		],
		"material",
	);
	quiz(8);
	quiz(9);
	const file = pointSchema.parse({
		versao: 1,
		trilha: "fmc",
		ponto: l.n,
		atividades: [
			{
				id: `fmc-v1-passo-${String(l.n).padStart(2, "0")}`,
				titulo: l.title,
				questoes: screens.map((e, i) => ({
					...e,
					numero: i + 1,
					ordem: i + 1,
				})),
			},
		],
	});
	await writeFile(
		new URL(`${String(l.n).padStart(2, "0")}.json`, directory),
		JSON.stringify(file, null, 2) + "\n",
	);
	manifest.passos.push({
		ponto: l.n,
		titulo: l.title,
		arquivo: `${String(l.n).padStart(2, "0")}.json`,
		telas: 17,
		questoes: 10,
		exemplos: 1,
	});
	const [prompt, answer, ...rest] = l.quiz[0];
	rest.pop();
	const options = [answer, ...rest];
	checks.push({
		prompt,
		alternatives: options.map((texto, i) => ({
			id: String.fromCharCode(97 + i),
			texto,
		})),
		answer: "a",
	});
	markdown += `## ${l.n}. ${l.title}\n\n${l.hook}\n\n${l.concept}\n\n${l.why}\n\n### Exemplo guiado\n\n${l.example.join("\n\n")}\n\n### Atenção\n\n${l.trap}\n\n### Aplicação\n\n${l.transfer}\n\n### Exercícios comentados\n\n${l.quiz
		.map(
			([q, correct, ...other], i) =>
				`${i + 1}. ${q}\n\n${choicesOf(l, i)
					.map((v, k) => `   ${String.fromCharCode(97 + k)}) ${v}`)
					.join("\n")}\n\nResposta: ${correct}\n\n${other.at(-1)}\n`,
		)
		.join("\n")}\nReferência: ${l.source}\n\n`;
	html += `<section id="passo-${l.n}"><h2>${l.n}. ${escapeHtml(l.title)}</h2><p>${escapeHtml(l.hook)}</p><h3>Conceito</h3><p>${escapeHtml(l.concept)}</p><h3>Por que funciona?</h3><p>${escapeHtml(l.why)}</p><h3>Exemplo guiado</h3><ol>${l.example.map((v) => `<li>${escapeHtml(v)}</li>`).join("")}</ol><h3>Investigue o erro</h3><p>${escapeHtml(l.trap)}</p><p>${escapeHtml(l.transfer)}</p><h3>Pratique</h3>${l.quiz
		.map(
			([q, correct, ...rest], i) =>
				`<article><h4>${i + 1}. ${escapeHtml(q)}</h4><ol type="a">${choicesOf(
					l,
					i,
				)
					.map((v) => `<li>${escapeHtml(v)}</li>`)
					.join(
						"",
					)}</ol><details><summary>Resposta comentada</summary><p>${escapeHtml(correct)}</p><p>${escapeHtml(rest.at(-1))}</p></details></article>`,
		)
		.join("")}<p>Referência: ${escapeHtml(l.source)}.</p></section>`;
}
await writeFile(
	new URL("manifesto.json", directory),
	JSON.stringify(manifest, null, 2) + "\n",
);
await writeFile(new URL("APOSTILA.md", directory), `${markdown.trimEnd()}\n`);
await writeFile(
	new URL("../src/server/fmc-material-checks.json", import.meta.url),
	JSON.stringify(checks, null, "\t") + "\n",
);
await writeFile(
	new URL("leitor.html", publicDirectory),
	`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FMC 1 · Material de estudo</title><style>body{font:18px/1.7 system-ui;max-width:56rem;margin:auto;padding:1.5rem;color:#18203b;background:#fafbff;overflow-wrap:anywhere}section{margin:3rem 0;border-top:1px solid #ccd0dd}article{padding:1rem;border:1px solid #ccd0dd;border-radius:12px;margin:1rem 0}a{color:#5143e3}summary{cursor:pointer;padding:.5rem}li{margin:.5rem 0}</style><header><h1>FMC 1 · Representar, demonstrar e contar</h1><p>Três unidades, 18 módulos, 180 exercícios comentados e 18 exemplos guiados. Material autoral baseado no recorte do Rosen.</p><a href="/aprender?modulo=fmc">Voltar à trilha</a><nav aria-label="Módulos">${lessons.map((l) => `<a href="#passo-${l.n}">${l.n}. ${escapeHtml(l.title)}</a><br>`).join("")}</nav></header><main>${html}</main></html>`,
);
console.log(
	"Gerados 18 módulos, 306 telas, 180 exercícios e 18 exemplos de FMC 1.",
);
