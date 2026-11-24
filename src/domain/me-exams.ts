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
export const examPath = (unit: ExamUnit) => `/aprender/elementar/prova-${unit}`;
