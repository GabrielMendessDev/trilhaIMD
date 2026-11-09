export type ContentBlock = { id: string } & (
	| { type: "heading"; text: string }
	| { type: "text"; text: string }
	| {
			type: "image";
			src: string;
			alt: string;
			width: number;
			height: number;
			caption?: string;
	  }
);

export type StageContent = {
	blocks: readonly ContentBlock[];
	summary?: string;
};

export type ActivityItem = { id: string; label: string };

export type WalkthroughStep = {
	id: string;
	title: string;
	blocks: readonly ContentBlock[];
};

export type Activity = { title?: string; prompt?: string } & (
	| { kind: "multipla-escolha"; choices: readonly ActivityItem[] }
	| {
			kind: "associacao";
			items: readonly ActivityItem[];
			options: readonly ActivityItem[];
	  }
	| {
			kind: "ligacao";
			sources: readonly ActivityItem[];
			targets: readonly ActivityItem[];
	  }
	| { kind: "passo-a-passo"; steps: readonly WalkthroughStep[] }
);

export type StageModel =
	| { mode: "conteudo"; content: StageContent }
	| { mode: "atividade"; activity: Activity }
	| { mode: "mista"; content: StageContent; activity: Activity };

export const stageModes = [
	{ id: "conteudo", label: "Conteúdo" },
	{ id: "atividade", label: "Atividade" },
	{ id: "mista", label: "Tela mista" },
] as const satisfies readonly { id: StageModel["mode"]; label: string }[];

export const activityFormats = [
	{
		label: "Múltipla escolha",
		description: "Cada alternativa aparece como uma opção de seleção.",
		empty: { kind: "multipla-escolha", choices: [] },
	},
	{
		label: "Associação",
		description: "Cada item tem um seletor para associá-lo a uma opção.",
		empty: { kind: "associacao", items: [], options: [] },
	},
	{
		label: "Ligar pares",
		description:
			"Cada ligação começa em um item e termina em outro. O mesmo número identifica os dois lados do par.",
		empty: { kind: "ligacao", sources: [], targets: [] },
	},
	{
		label: "Passo a passo",
		description:
			"Cada passo abre uma tela com suas próprias instruções e materiais.",
		empty: { kind: "passo-a-passo", steps: [] },
	},
] as const satisfies readonly {
	label: string;
	description: string;
	empty: Activity;
}[];
