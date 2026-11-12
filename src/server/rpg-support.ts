import "server-only";
import { db } from "./db";
import type { Entry } from "./lesson";
import type { RpgTx } from "./rpg";

// Authored and checked variants. They are server-only: answers never enter the catalog bundle.
const rows = [
	[
		"Representação de conjuntos",
		"Um app recebeu as tags api, api e ui. Qual é o conjunto de tags?",
		["{api, api, ui}", "{api, ui}", "{api}", "{ui}"],
		1,
		"Em {foto, áudio, foto}, removemos a repetição: {foto, áudio}. Um conjunto guarda cada elemento uma vez.",
	],
	[
		"Interseção",
		"A = {1, 2, 3} e B = {2, 3, 4}. Qual é A ∩ B?",
		["{1, 4}", "{1, 2, 3, 4}", "{2, 3}", "∅"],
		2,
		"Em C = {azul, verde} e D = {verde, rosa}, só verde aparece nos dois: C ∩ D = {verde}.",
	],
	[
		"Contagem com potências",
		"Três interruptores têm duas posições cada. Quantas configurações existem?",
		["5", "6", "8", "9"],
		2,
		"Quatro escolhas com três opções independentes produzem 3⁴ = 81 combinações. Multiplique o mesmo número de opções por escolha.",
	],
	[
		"Definição de logaritmo",
		"Se log₂(x) = 3, quanto vale x?",
		["6", "8", "9", "16"],
		1,
		"log₃(81) = 4 porque 3⁴ = 81. O logaritmo pergunta qual expoente produz o argumento.",
	],
	[
		"União e interseção",
		"C = {2, 4} e D = {4, 6}. Qual é C ∪ D?",
		["{4}", "{2, 6}", "{2, 4, 6}", "∅"],
		2,
		"A união de {a, b} com {b, c} é {a, b, c}. Reúna os elementos sem repeti-los.",
	],
	[
		"Equação linear",
		"Um serviço cobra 2x + 3 = 11 reais. Qual é x?",
		["3", "4", "5", "7"],
		1,
		"Em 3y + 2 = 20, subtraia 2 dos dois lados e depois divida por 3: y = 6. Operações equivalentes preservam a igualdade.",
	],
	[
		"Raízes de uma quadrática",
		"Quais são as raízes de x² − 5x + 6 = 0?",
		["{1, 6}", "{−2, −3}", "{2, 3}", "{0, 5}"],
		2,
		"Em y² − 7y + 12 = 0, fatoramos (y − 3)(y − 4). Cada fator pode valer zero: y = 3 ou y = 4.",
	],
	[
		"Inequação linear",
		"Para quais reais vale 2x + 1 > 7?",
		["x > 3", "x < 3", "x ≥ 4", "x > 4"],
		0,
		"Em 3y − 2 ≤ 10, some 2 e divida por 3: y ≤ 4. Só inverteríamos o sinal ao dividir por número negativo.",
	],
	[
		"Zeros de um produto",
		"Quais valores zeram (x − 1)(x + 2)?",
		["{1, 2}", "{−1, 2}", "{−2, 1}", "{−2, −1}"],
		2,
		"Para (y − 4)(y + 3) = 0, um dos fatores deve ser zero: y = 4 ou y = −3. Confira substituindo.",
	],
	[
		"Diferença de conjuntos",
		"A = {p, q, r} e B = {q}. Qual é A ∖ B?",
		["{q}", "{p, r}", "{p, q, r}", "∅"],
		1,
		"Se C = {1, 2, 3, 4} e D = {2, 4}, retiramos de C os elementos de D: C ∖ D = {1, 3}.",
	],
] as const;
export function supportFor(number: number) {
	const row = rows[number - 1];
	if (!row) return;
	return {
		id: `elementar-extra-${number}`,
		topic: row[0],
		prompt: row[1],
		alternatives: row[2].map((text, index) => ({
			id: `extra-${index}`,
			texto: text,
		})),
		answer: `extra-${row[3]}`,
		hint: [
			"Conjuntos não repetem elementos. Confira quais nomes distintos aparecem.",
			"Interseção guarda somente os elementos presentes nos dois conjuntos.",
			"Cada interruptor acrescenta uma escolha independente. Multiplique as quantidades de opções.",
			"Converta o logaritmo para uma potência: a base elevada ao expoente deve produzir o argumento.",
			"União reúne os elementos dos conjuntos, sem repetições.",
			"Desfaça a soma antes da multiplicação, aplicando a mesma operação nos dois lados.",
			"Procure dois números cuja soma e produto correspondam aos coeficientes da equação.",
			"Isole a incógnita dos dois lados. Observe o sinal do número pelo qual vai dividir.",
			"Um produto vale zero quando pelo menos um dos fatores vale zero.",
			"Na diferença, mantenha os elementos do primeiro conjunto que não aparecem no segundo.",
		][number - 1],
		example: row[4],
	};
}
export type QuestionEffects = {
	hint?: string;
	example?: string;
	removed?: string[];
	replacement?: Entry;
	deferred?: boolean;
	skipped?: boolean;
};
export type QuestionState = { effects: QuestionEffects; assisted: boolean };
export async function getQuestionState(
	userId: string,
	pointId: number,
	entryKey: string,
	tx: RpgTx = db,
) {
	const [row] = await tx.$queryRaw<
		QuestionState[]
	>`SELECT effects,assisted FROM "RpgQuestionState" WHERE "userId"=${userId} AND "pointId"=${pointId} AND "entryKey"=${entryKey}`;
	return row ?? { effects: {}, assisted: false };
}
export const effectiveEntry = (entry: Entry, effects?: QuestionEffects) =>
	effects?.replacement ? { ...effects.replacement, key: entry.key } : entry;
export function replacementFor(entry: Entry, number: number) {
	const extra = supportFor(number);
	const metadata = entry.payload as {
		assunto?: string;
		dificuldade?: string;
	} | null;
	if (
		!extra ||
		entry.type !== "MULTIPLE_CHOICE" ||
		metadata?.assunto !== extra.topic ||
		(metadata.dificuldade && metadata.dificuldade !== "basica")
	)
		return;
	return {
		...entry,
		key: extra.id,
		prompt: extra.prompt,
		answer: extra.answer,
		payload: {
			alternativas: extra.alternatives,
			assunto: extra.topic,
			dificuldade: "basica",
			orientacao: extra.hint,
			explicacao: extra.example,
		},
	};
}
export function contextualExample(entry: Entry, number: number) {
	const extra = supportFor(number);
	return extra &&
		extra.topic === (entry.payload as { assunto?: string } | null)?.assunto
		? extra.example
		: undefined;
}
