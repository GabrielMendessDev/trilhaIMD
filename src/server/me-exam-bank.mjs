import { z } from "zod";
import { unitThreeRows } from "./me-exam-unit-three.mjs";
import { unitTwoRows } from "./me-exam-unit-two.mjs";

export const questionSchema = z.object({
	id: z.string(),
	topic: z.string(),
	prompt: z.string(),
	choices: z.array(z.object({ id: z.string(), text: z.string() })).length(4),
	answer: z.string(),
	explanation: z.string(),
});
export const examSchema = z.array(questionSchema).length(20);
export const answersSchema = z.record(z.string(), z.string());

export const examVersion = 2;
/** @type {[string,string,string[],number,string][]} */
const rows = [
	[
		"Conjuntos",
		"A = {1, 2, 4} e B = {2, 3, 4}. Qual é A ∖ B?",
		["{1}", "{3}", "{2, 4}", "{1, 3}"],
		0,
		"A diferença mantém os elementos de A ausentes em B. Apenas 1 atende à condição.",
	],
	[
		"Conjuntos e reais",
		"Qual número é racional e não inteiro?",
		["√5", "−7", "0", "−3/4"],
		3,
		"−3/4 é razão de inteiros e não é inteiro. √5 é irracional.",
	],
	[
		"Intervalos",
		"Qual é a interseção de [−1, 4) e (2, 6]?",
		["[2, 4]", "(2, 4)", "[−1, 6]", "(−1, 2)"],
		1,
		"Os valores comuns são maiores que 2 e menores que 4. Ambos os extremos são excluídos.",
	],
	[
		"Potências",
		"Simplifique 3⁷/3⁴.",
		["3³", "3¹¹", "3²⁸", "1"],
		0,
		"Na divisão de potências de mesma base não nula, subtraia os expoentes: 7−4=3.",
	],
	[
		"Potências e raízes",
		"Quanto vale 16^(3/4)?",
		["4", "12", "64", "8"],
		3,
		"A raiz quarta principal de 16 é 2, e 2³=8.",
	],
	[
		"Logaritmos",
		"Quanto vale log₂(32)?",
		["4", "5", "16", "64"],
		1,
		"Como 2⁵=32, log₂(32)=5.",
	],
	[
		"Domínio dos logaritmos",
		"Para quais valores reais de x existe log₃(x − 2)?",
		["x ≥ 2", "x < 2", "x > 2", "x ≠ 2"],
		2,
		"O argumento deve ser positivo: x−2>0, portanto x>2.",
	],
	[
		"Propriedades dos logaritmos",
		"Se log₁₀(a)=2 e log₁₀(b)=3, com a,b>0, quanto vale log₁₀(ab)?",
		["6", "1", "8", "5"],
		3,
		"O logaritmo do produto é a soma: 2+3=5.",
	],
	[
		"Equações logarítmicas",
		"Resolva log₂(x − 1)=3 em ℝ.",
		["9", "7", "5", "4"],
		0,
		"x−1=2³=8, logo x=9; esse valor satisfaz x>1.",
	],
	[
		"Radicais",
		"Para x real, qual expressão é igual a √(x²)?",
		["x", "−x", "|x|", "x²"],
		2,
		"A raiz principal é não negativa; √(x²)=|x|, inclusive quando x<0.",
	],
	[
		"Equações lineares",
		"Resolva 3(x − 2) + 4 = 13 em ℝ.",
		["3", "5", "7", "9"],
		1,
		"3x−6+4=13 dá 3x=15 e x=5.",
	],
	[
		"Sistemas",
		"Qual par (x, y) resolve x + y = 11 e 2x − y = 4?",
		["(6, 5)", "(7, 4)", "(5, 6)", "(4, 7)"],
		2,
		"Somando as equações, 3x=15. Logo x=5 e y=6.",
	],
	[
		"Equações quadráticas",
		"Qual é o conjunto-solução real de x² − 7x + 10 = 0?",
		["{2, 5}", "{−2, −5}", "{−2, 5}", "{1, 10}"],
		0,
		"(x−2)(x−5)=0 fornece 2 e 5.",
	],
	[
		"Equações biquadradas",
		"Resolva x⁴ − 13x² + 36 = 0 em ℝ.",
		["{4, 9}", "{2, 3}", "{−9, −4, 4, 9}", "{−3, −2, 2, 3}"],
		3,
		"Com t=x², temos (t−4)(t−9)=0. Voltando a x, obtemos ±2 e ±3.",
	],
	[
		"Inequações lineares",
		"Resolva 5 − 2x ≥ 11 em ℝ.",
		["[−3, ∞)", "(−∞, −3]", "(−∞, 3]", "(−3, ∞)"],
		1,
		"−2x≥6. Ao dividir por −2, inverta a desigualdade: x≤−3.",
	],
	[
		"Inequações quadráticas",
		"Resolva x² − 5x + 6 < 0 em ℝ.",
		["[2, 3]", "(−∞, 2) ∪ (3, ∞)", "(2, 3)", "(−∞, 2] ∪ [3, ∞)"],
		2,
		"(x−2)(x−3) é negativo entre as raízes. A comparação estrita exclui 2 e 3.",
	],
	[
		"Inequações quociente",
		"Resolva (x − 1)/(x + 2) ≤ 0 em ℝ.",
		["(−2, 1]", "[−2, 1]", "(−∞, −2) ∪ [1, ∞)", "(−2, 1)"],
		0,
		"O quociente é negativo entre −2 e 1. Inclua 1, zero do numerador, e exclua −2, fora do domínio.",
	],
	[
		"Sistemas e classificação",
		"Qual descrição corresponde ao sistema x+y=2 e 2x+2y=5?",
		["Uma solução", "Infinitas soluções", "Nenhuma solução", "Duas soluções"],
		2,
		"Multiplicar a primeira equação por 2 daria 2x+2y=4, incompatível com 5.",
	],
	[
		"Discriminante",
		"Para qual valor de k a equação x²−6x+k=0 tem uma única raiz real distinta?",
		["3", "6", "9", "12"],
		2,
		"A raiz é dupla quando Δ=36−4k=0, isto é, k=9.",
	],
	[
		"Problema integrador",
		"Uma placa retangular tem lados x e x+2 metros, com x>0. Sua área é 24 m². Qual valor de x é possível?",
		["6", "−6", "4", "3"],
		2,
		"x(x+2)=24 resulta em x²+2x−24=0. As raízes são 4 e −6; apenas 4 é positiva.",
	],
];
export const unitOneExam = examSchema.parse(
	rows.map(([topic, prompt, texts, correct, explanation], i) => ({
		id: `u1-${i + 1}`,
		topic,
		prompt,
		choices: texts.map((text, j) => ({ id: String(j), text })),
		answer: String(correct),
		explanation,
	})),
);
/** @param {z.infer<typeof examSchema>} questions
 * @param {Record<string,string>} answers */
export function examScore(questions, answers) {
	return questions.reduce(
		(total, q) => total + Number(answers[q.id] === q.answer),
		0,
	);
}

/** @param {2|3} unit @param {[string,string,string[],number,string][]} items */
function makeExam(unit, items) {
	return examSchema.parse(
		items.map(([topic, prompt, texts, correct, explanation], i) => ({
			id: `u${unit}-${i + 1}`,
			topic,
			prompt,
			choices: texts.map((text, j) => ({ id: String(j), text })),
			answer: String(correct),
			explanation,
		})),
	);
}
export const unitTwoExam = makeExam(2, unitTwoRows);
export const unitThreeExam = makeExam(3, unitThreeRows);
/** @param {1|2|3} unit */
export function getExamDefinition(unit) {
	const banks = { 1: unitOneExam, 2: unitTwoExam, 3: unitThreeExam };
	return { questions: banks[unit], version: unit === 1 ? examVersion : 1 };
}
