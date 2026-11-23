export const analyticsPreference = "trilbit-analytics";
export const sessionIdleMs = 30 * 60_000;

export const screens = {
	"/": "Início",
	"/aprender": "Trilhas",
	"/disciplinas": "Disciplinas",
	"/disciplinas/trilha": "Detalhe da disciplina",
	"/aprender/etapa": "Etapa",
	"/aprender/questao": "Questão",
	"/aprender/revisao": "Revisão",
	"/aprender/material": "Material de estudo",
	"/aprender/resultado": "Resultado da questão",
	"/progresso": "Progresso",
	"/niveis": "Níveis e recompensas",
	"/conquistas": "Conquistas",
	"/missoes": "Missões",
	"/loja": "Loja",
	"/mochila": "Mochila",
	"/perfil": "Perfil",
	"/ranking": "Ranking",
	"/login": "Login",
} as const;

export type Screen = keyof typeof screens;
export const devices = ["Celular", "Tablet", "Computador", "Outro"] as const;
export const viewports = [
	"Até 479 px",
	"480 a 767 px",
	"768 a 1023 px",
	"1024 a 1439 px",
	"1440 px ou mais",
] as const;
export const fatigueBands = [
	"Até 5 min",
	"5 a 15 min",
	"15 a 30 min",
	"30 min ou mais",
];
export const recallBands = [
	"1 a 2 dias",
	"3 a 6 dias",
	"7 a 13 dias",
	"14 a 29 dias",
	"30 dias ou mais",
];
