import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { generateFigures } from "./autoria/figuras.mjs";
import { studyPage } from "./autoria/leitor.mjs";
import { roteiro } from "./autoria/roteiros.mjs";
import unit1 from "./autoria/unidade-1.mjs";
import unit2 from "./autoria/unidade-2.mjs";
import unit3 from "./autoria/unidade-3.mjs";
import { pointSchema } from "./esquema-conteudo.mjs";

const root = new URL("../", import.meta.url);
const output = new URL("conteudos/elementar/", root);
const publicOutput = new URL("public/materiais/elementar/", root);
await mkdir(publicOutput, { recursive: true });
const lessons = [...unit1, ...unit2, ...unit3];
if (lessons.length !== 60 || lessons.some((l, i) => l.n !== i + 1))
	throw new Error("A sequência deve ser 1…60, sem lacunas.");
const figures = await generateFigures(publicOutput);
const text = (id, value) => ({ id, tipo: "texto", texto: value });
const content = (title, values, category = "explicacao") => ({
	titulo: title,
	categoria: category,
	blocos: values.map((value, i) => text(`texto-${i + 1}`, value)),
});
const source =
	"Referência curricular: IMD1001_acervo_unificado_P1_P2_P3.md, fornecido pelo estudante; recorte P1/P2/P3 de 2025.2. Texto, exemplos e questões desta versão são autorais. Os PDFs de P2/P3 não foram conferidos diretamente nesta produção. As exclusões de 2025.2 não devem ser presumidas para outras ofertas.";
const files = [];
for (const l of lessons) {
	const screens = [];
	const addContent = (title, paragraphs, category) =>
		screens.push({
			modo: "conteudo",
			conteudo: content(title, paragraphs, category),
		});
	const quiz = (i) => {
		const [prompt, correct, ...rest] = l.quiz[i];
		const explanation = rest.pop();
		const choices = [correct, ...rest];
		const shift = (l.n + i) % choices.length;
		const alternatives = choices.map((_, j) => ({
			id: String.fromCharCode(97 + j),
			texto: choices[(j + shift) % choices.length],
		}));
		const answer = alternatives.find((option) => option.texto === correct).id;
		screens.push({
			modo: "questao",
			questao: {
				tipo: "multipla-escolha",
				enunciado: prompt,
				alternativas: alternatives,
				gabarito: answer,
				assunto: l.title,
				orientacao: roteiro(l.n).dica,
				explicacao: explanation,
				essencial: i === 9,
			},
		});
	};
	addContent(l.title, [
		l.hook,
		`Ao concluir: ${l.goal}`,
		`Para começar: ${l.prereq}`,
	]);
	addContent("Dar nome às ideias", [l.concept]);
	const concept = screens.at(-1).conteudo;
	concept.blocos.push({
		id: "formula-central",
		tipo: "formula",
		leitura: roteiro(l.n).leitura,
		termos: [{ forma: "texto", valor: roteiro(l.n).formula }],
	});
	quiz(0);
	addContent("Por que isso funciona?", [l.why]);
	const reasoning = screens.at(-1).conteudo;
	if (figures[l.n]) {
		const f = figures[l.n];
		reasoning.blocos.push({
			id: "figura",
			tipo: "imagem",
			src: `/materiais/elementar/${f.file}`,
			alt: f.alt,
			largura: 720,
			altura: 440,
			legenda: f.alt,
		});
	} else {
		reasoning.blocos.push({
			id: "roteiro",
			tipo: "diagrama",
			legenda: "Roteiro de leitura: objetivo e teste de consistência.",
			dados: {
				modelo: "quadro",
				linhas: [
					{ simbolo: "Objetivo", leitura: l.goal, exemplo: l.example[0] },
					{
						simbolo: "Conferência",
						leitura: "Volte às condições da expressão original.",
						exemplo: l.example[2],
					},
				],
			},
		});
	}
	quiz(1);
	screens.push({
		modo: "questao",
		questao: {
			tipo: "passo-a-passo",
			enunciado: `Exemplo resolvido · ${l.title}`,
			assunto: l.title,
			passos: l.example.map((p, i) => ({
				id: `passo-${i + 1}`,
				titulo: [
					"Organizar as informações",
					"Desenvolver o raciocínio",
					"Concluir e conferir",
				][i],
				blocos: [text(`exemplo-${i + 1}`, p)],
			})),
		},
	});
	quiz(2);
	quiz(3);
	addContent("O erro que vale investigar", [
		l.trap,
		"Antes de seguir: explique o erro em suas palavras e construa um exemplo que o torne visível.",
	]);
	quiz(4);
	quiz(5);
	addContent("Levar a ideia para outra situação", [l.transfer]);
	quiz(6);
	quiz(7);
	addContent(
		"Mapa de bolso",
		[
			l.concept,
			`Verificação: ${l.example[2]}`,
			`Recuperação ativa: explique como ${l.goal.charAt(0).toLowerCase() + l.goal.slice(1)} Depois reconstrua o exemplo sem consultar a solução.`,
			source,
		],
		"material",
	);
	quiz(8);
	quiz(9);
	const file = pointSchema.parse({
		versao: 1,
		trilha: "elementar",
		ponto: l.n,
		atividades: [
			{
				id: `elementar-v2-passo-${String(l.n).padStart(2, "0")}`,
				titulo: l.title,
				questoes: screens.map((s, i) => ({
					...s,
					numero: i + 1,
					ordem: i + 1,
				})),
			},
		],
	});
	files.push(file);
	await writeFile(
		new URL(`${String(l.n).padStart(2, "0")}.json`, output),
		JSON.stringify(file, null, 2) + "\n",
	);
}

const intro = `# Matemática Elementar · Trilha completa\n\nVersão integral reescrita em 12/11/2026. Três unidades, 20 passos por unidade e 17 telas por passo: **1.020 telas**, **600 questões corrigíveis** e **60 exemplos guiados**, cada um com três momentos de resolução. As questões são autorais e têm respostas comentadas.\n\nEsta apostila acompanha a sequência do aplicativo e também pode ser lida sem login no leitor em HTML. ‘Tela’ designa uma entrada didática da trilha, e não uma página impressa ou uma altura fixa de dispositivo. Não há cronômetro obrigatório; avance, volte e reveja as soluções no seu ritmo.\n\n${source}\n\nA linguagem leve não altera as condições matemáticas. Contextos quantitativos são fictícios e servem ao estudo. Não pressupomos repertório de um curso, equipamento pessoal ou disponibilidade financeira. Figuras têm descrições textuais; símbolos são explicados no próprio texto.\n\n## Como estudar\n\n1. Leia o problema inicial e formule uma hipótese antes da definição.\n2. Leia a justificativa e percorra o exemplo em três momentos.\n3. Responda às questões antes de consultar a solução.\n4. Ao errar, identifique se a dificuldade foi de interpretação, condição, sinal ou método e volte à explicação correspondente.\n5. Na revisão final, escreva a solução discursiva indicada no texto.\n\n## Unidades\n\n- Unidade 1, passos 1–20: conjuntos, números, potências, logaritmos, equações e inequações.\n- Unidade 2, passos 21–40: polinômios, relações e funções, retas e parábolas.\n- Unidade 3, passos 41–60: simetria, funções por partes, exponenciais, trigonometria, matrizes e determinantes.\n\n`;
const renderBlocks = (blocks) =>
	blocks
		.map((b) =>
			b.tipo === "texto"
				? b.texto
				: b.tipo === "formula"
					? `**${b.termos.map((t) => t.valor).join(" ")}**\n\nLeitura: ${b.leitura}`
					: b.tipo === "imagem"
						? `![${b.alt}](../../public${b.src})`
						: b.tipo === "diagrama"
							? b.dados.linhas
									.map((r) => `- **${r.simbolo}:** ${r.leitura} ${r.exemplo}`)
									.join("\n")
							: "",
		)
		.join("\n\n");
const markdownPoint = (file) => {
	const activity = file.atividades[0];
	return (
		`## Passo ${file.ponto} · ${activity.titulo}\n\n` +
		activity.questoes
			.map((e) => {
				if (e.modo === "conteudo")
					return `### Tela ${e.numero} · ${e.conteudo.titulo}\n\n${renderBlocks(e.conteudo.blocos)}\n`;
				const q = e.questao;
				if (q.tipo === "passo-a-passo")
					return (
						`### Tela ${e.numero} · Exemplo guiado\n\n` +
						q.passos
							.map(
								(s, i) =>
									`**${i + 1}. ${s.titulo}**\n\n${renderBlocks(s.blocos)}`,
							)
							.join("\n\n") +
						"\n"
					);
				return `### Tela ${e.numero} · Pratique\n\n${q.enunciado}\n\n${q.alternativas.map((a) => `${a.id.toUpperCase()}) ${a.texto}`).join("\n\n")}\n\n<details>\n<summary>Resposta comentada — consulte depois de tentar</summary>\n\n**${q.gabarito.toUpperCase()}.** ${q.explicacao}\n\n</details>\n`;
			})
			.join("\n")
	);
};
const body = files.map(markdownPoint);
await writeFile(
	new URL("APOSTILA-COMPLETA.md", output),
	(intro + body.join("\n---\n\n")).replace(/\{(?=[{%])/g, "&#123;"),
);
for (let u = 1; u <= 3; u++) {
	const directory = new URL(`unidade-${u}/`, output);
	await mkdir(directory, { recursive: true });
	const subset = files.slice((u - 1) * 20, u * 20);
	await writeFile(
		new URL("README.md", directory),
		`# Matemática Elementar · Unidade ${u}\n\nVersão reescrita: passos ${(u - 1) * 20 + 1}–${u * 20}, 340 telas, 200 questões e 20 exemplos guiados.\n\n| Passo | Tema | Objetivo |\n| --- | --- | --- |\n${subset.map((f, i) => `| [${f.ponto}](../${String(f.ponto).padStart(2, "0")}.json) | ${f.atividades[0].titulo} | ${lessons[(u - 1) * 20 + i].goal} |`).join("\n")}\n\nConsulte a [apostila completa](../APOSTILA-COMPLETA.md), o [manifesto](../manifesto.json) e o [guia da trilha](../README.md). Anotações anteriores da Unidade 1, quando presentes, são histórico editorial; a sequência vigente é a deste índice.\n`,
	);
}
const manifest = {
	versao: 2,
	data: "2026-11-12",
	trilha: "elementar",
	fonte: "IMD1001_acervo_unificado_P1_P2_P3.md",
	unidades: [1, 2, 3].map((u) => ({
		unidade: u,
		inicio: (u - 1) * 20 + 1,
		fim: u * 20,
	})),
	passos: files.map((f) => ({
		ponto: f.ponto,
		arquivo: `${String(f.ponto).padStart(2, "0")}.json`,
		titulo: f.atividades[0].titulo,
		telas: 17,
		questoes: 10,
		exemplos: 1,
	})),
	totais: { passos: 60, telas: 1020, questoes: 600, exemplos: 60 },
};
await writeFile(
	new URL("manifesto.json", output),
	JSON.stringify(manifest, null, 2) + "\n",
);
const sora = (
	await readFile(new URL("public/fonts/sora.woff2", root))
).toString("base64");
await writeFile(new URL("index.html", publicOutput), studyPage(files, sora));
await writeFile(
	new URL("src/server/elementar-material-checks.json", root),
	JSON.stringify(
		files.map((f) => {
			const q = f.atividades[0].questoes.find(
				(e) => e.questao?.tipo === "multipla-escolha",
			).questao;
			return {
				prompt: q.enunciado,
				alternatives: q.alternativas,
				answer: q.gabarito,
			};
		}),
		null,
		2,
	) + "\n",
);
await writeFile(
	new URL("README.md", output),
	`# Matemática Elementar · 60 passos\n\nA sequência foi **inteiramente reescrita**, incluindo os antigos passos 1 a 10. Cada unidade contém 20 passos e cada passo contém **17 telas**, com 10 questões corrigíveis, seis telas de leitura e um exemplo guiado em três momentos. Total: **1.020 telas, 600 questões e 60 exemplos resolvidos**.\n\n- [Unidade 1 — passos 1–20](unidade-1/README.md)\n- [Unidade 2 — passos 21–40](unidade-2/README.md)\n- [Unidade 3 — passos 41–60](unidade-3/README.md)\n- [Apostila completa em Markdown](APOSTILA-COMPLETA.md)\n- [Leitor interativo independente](../../public/materiais/elementar/index.html) — pode ser aberto diretamente no navegador; funciona sem banco, login ou conexão.\n- [Matriz de cobertura curricular](COBERTURA.md)\n\n## Autoria e manutenção\n\nAs fontes editoriais estão em scripts/autoria. Execute npm run conteudo:gerar:elementar para gerar os 60 JSONs, a apostila e o leitor. Execute npm run test:elementar para verificar sequência, telas, alternativas, recursos locais e gabaritos de exemplos calculáveis.\n\n${source}\n\n## Publicação no aplicativo\n\nOs 60 JSONs obedecem ao esquema existente. O comando npm run conteudo:publicar:elementar valida todos os arquivos antes de gravar e substitui somente as atividades da trilha elementar em uma transação. Ele salva um backup local do catálogo anterior. Havendo progresso na distribuição antiga, arquiva os pontos anteriores com seus IDs, respostas, conclusões, XP, leituras e auxílios; os 60 passos novos recebem IDs próprios e progresso independente. O histórico arquivado continua disponível nas métricas e não aparece no mapa ativo. A reimportação da mesma versão é idempotente. Não altere IDs e números de telas depois de começar a coletar progresso.\n\nO leitor independente é material de estudo: respostas ficam disponíveis para autocorreção e não geram XP, notas oficiais ou progresso do aplicativo. O aplicativo mantém sua correção no servidor após a importação.\n`,
);
console.log(
	`Gerados ${files.length} passos, 1.020 telas e 600 questões. Apostila e leitor: ${fileURLToPath(output)}`,
);
