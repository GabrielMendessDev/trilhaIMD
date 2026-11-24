export type ExamTrail = "elementar" | "fmc";
export type ExamUnit = 1 | 2 | 3;
export const examUnits: readonly ExamUnit[] = [1, 2, 3];
export const meExams = {
	1: {
		title: "Fundamentos e equações",
		description:
			"20 questões sobre conjuntos, números reais, intervalos, potências, radicais, logaritmos, equações, sistemas e inequações.",
	},
	2: {
		title: "Polinômios e funções",
		description:
			"20 questões sobre polinômios, operações, fatoração, raízes, divisão, relações, domínio, imagem, composição, inversa, funções afins e quadráticas.",
	},
	3: {
		title: "Funções especiais, trigonometria e matrizes",
		description:
			"20 questões sobre simetria, funções por partes, periodicidade, exponenciais, logaritmos, trigonometria, operações matriciais, determinantes e inversas.",
	},
} satisfies Record<ExamUnit, { title: string; description: string }>;
export const fmcExams = {
	1: {
		title: "Representar e justificar",
		description:
			"20 questões sobre linguagem matemática, bases numéricas, representação computacional, demonstrações, indução e recursão.",
	},
	2: {
		title: "Entender os números inteiros",
		description:
			"20 questões sobre divisibilidade, divisão euclidiana, MDC, MMC, primos, congruências, inversos e aplicações.",
	},
	3: {
		title: "Contar e reconhecer padrões",
		description:
			"20 questões sobre contagem, permutações, combinações, inclusão-exclusão, princípio das gavetas e recorrências.",
	},
} satisfies Record<ExamUnit, { title: string; description: string }>;
export const examPath = (unit: ExamUnit, trail: ExamTrail = "elementar") =>
	`/aprender/${trail}/prova-${unit}`;
