export type TrailId = "elementar" | "combinatoria" | "calculo" | "fmc" | "vga";

export function stageChallenge(stage: number) {
	if (stage === 10) return "Desafio final";
	if (stage === 5) return "Desafio";
}

export function trailMapHref(trailId: TrailId, stage?: number) {
	const query = new URLSearchParams();
	if (trailId !== "elementar") query.set("modulo", trailId);
	if (stage !== undefined) query.set("etapa", String(stage));
	return query.size
		? `/aprender?${query}${stage === undefined ? "" : `#etapa-${stage}`}`
		: "/aprender";
}

type Trail = {
	id: TrailId;
	name: string;
	label: string;
	notation: string;
	description: string;
	diagramTitle: string;
	diagramCaption: string;
	positions: readonly number[];
	connection: "curve" | "branch" | "circuit" | "line";
};

export const trails = [
	{
		id: "elementar",
		name: "Matemática Elementar",
		label: "Elementar",
		notation: "Σ",
		description: "Explore a base para trabalhar com números e expressões.",
		diagramTitle: "Reta numérica",
		diagramCaption: "Na reta, a posição mostra a ordem dos números.",
		positions: [38, 51, 68, 61, 40, 27, 40, 60, 67, 50],
		connection: "curve",
	},
	{
		id: "combinatoria",
		name: "Análise Combinatória",
		label: "Combinatória",
		notation: "n!",
		description:
			"Explore maneiras de organizar escolhas e contar possibilidades.",
		diagramTitle: "Árvore de escolhas",
		diagramCaption:
			"Cada ramo representa uma escolha. As pontas mostram os resultados possíveis.",
		positions: [30, 48, 68, 69, 48, 28, 27, 47, 70, 54],
		connection: "branch",
	},
	{
		id: "calculo",
		name: "Cálculo 1",
		label: "Cálculo 1",
		notation: "∫",
		description:
			"Explore como as funções mudam e como essa variação se acumula.",
		diagramTitle: "Curva e tangente",
		diagramCaption:
			"A inclinação da tangente mostra a taxa de variação naquele ponto.",
		positions: [24, 25, 27, 32, 40, 49, 58, 66, 72, 76],
		connection: "curve",
	},
	{
		id: "fmc",
		name: "Fundamentos de Matemática para Computação",
		label: "FMC 1",
		notation: "01",
		description:
			"Explore a lógica e as estruturas matemáticas que sustentam a computação.",
		diagramTitle: "Porta lógica E",
		diagramCaption: "A saída vale 1 quando as duas entradas valem 1.",
		positions: [31, 31, 65, 65, 48, 48, 25, 25, 69, 69],
		connection: "circuit",
	},
	{
		id: "vga",
		name: "Vetores e Geometria Analítica 1",
		label: "VGA",
		notation: "x,y",
		description: "Explore direções, coordenadas e formas no espaço.",
		diagramTitle: "Soma de vetores",
		diagramCaption:
			"Ao colocar um vetor na ponta do outro, a seta resultante vai do início ao fim.",
		positions: [70, 34, 65, 28, 50, 75, 39, 65, 30, 51],
		connection: "line",
	},
] as const satisfies readonly Trail[];
