export const economy = {
	lessonBits: 10,
	perfectBits: 5,
	dailyBits: 10,
	minimumAnswerRatio: 0.5,
	materialSeconds: 15,
	stagesPerTrail: 10,
} as const;
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export const rarityNames: Record<Rarity, string> = {
	common: "Comum",
	uncommon: "Incomum",
	rare: "Rara",
	epic: "Épica",
	legendary: "Lendária",
};
export const categoryNames = {
	ofensiva: "Ofensiva",
	sequencia: "Sequência de acertos",
	acertos: "Total de acertos",
	licoes: "Lições",
	perfeicao: "Perfeição",
	revisao: "Revisão e superação",
	exploracao: "Exploração",
} as const;
export type Stats = {
	studyStreak: number;
	bestStudyStreak: number;
	combo: number;
	bestCombo: number;
	correct: number;
	lessons: number;
	perfect: number;
	perfectRun: number;
	bestPerfectRun: number;
	reviews: number;
	recovered: number;
	trails: number;
	disciplines: number;
	materials: number;
};
export const emptyStats = (): Stats => ({
	studyStreak: 0,
	bestStudyStreak: 0,
	combo: 0,
	bestCombo: 0,
	correct: 0,
	lessons: 0,
	perfect: 0,
	perfectRun: 0,
	bestPerfectRun: 0,
	reviews: 0,
	recovered: 0,
	trails: 0,
	disciplines: 0,
	materials: 0,
});
export type Metric = keyof Stats;
type AchievementRow = readonly [string, number, number, number];
type Category = keyof typeof categoryNames;
function group(
	category: Category,
	metric: Metric,
	rows: readonly AchievementRow[],
	rarities: readonly Rarity[],
	unit: string,
) {
	return rows.map(([name, goal, xp, bits], index) => ({
		id: `${metric}-${goal}`,
		name,
		description: `${goal} ${goal === 1 ? unit.replace("dias válidos", "dia válido").replace("lições distintas concluídas", "lição distinta concluída").replace("lições com", "lição com").replace("trilhas distintas concluídas", "trilha distinta concluída").replace("disciplinas concluídas", "disciplina concluída") : unit}`,
		category,
		metric,
		goal,
		xp,
		bits,
		rarity: rarities[index] ?? "rare",
		symbol: `${category}-${index + 1}`,
	}));
}
export const achievements = [
	...group(
		"ofensiva",
		"bestStudyStreak",
		[
			["Primeiro Passo", 1, 20, 10],
			["Pegando Ritmo", 3, 60, 20],
			["Semana de Ferro", 7, 140, 45],
			["Persistente", 14, 240, 80],
			["Disciplina de Aço", 30, 500, 170],
			["Incansável", 60, 850, 300],
			["Centurião", 100, 1500, 550],
			["Lenda do Tempo", 365, 5000, 1800],
		],
		[
			"common",
			"common",
			"uncommon",
			"rare",
			"epic",
			"epic",
			"legendary",
			"legendary",
		],
		"dias válidos na mesma ofensiva. Proteção preserva a sequência, sem somar dia estudado.",
	),
	...group(
		"sequencia",
		"bestCombo",
		[
			["Mente Afiada", 3, 30, 10],
			["Engrenagens Ligadas", 5, 50, 20],
			["Concentração Total", 10, 100, 35],
			["Precisão Cirúrgica", 20, 220, 75],
			["Mente Imparável", 50, 650, 220],
			["Oráculo do Saber", 100, 1600, 500],
		],
		["common", "common", "uncommon", "rare", "epic", "legendary"],
		"acertos únicos seguidos, de primeira e sem auxílio.",
	),
	...group(
		"acertos",
		"correct",
		[
			["Primeiro Acerto", 10, 60, 20],
			["Aprendiz Curioso", 25, 125, 40],
			["Explorador do Saber", 50, 240, 80],
			["Cem Respostas", 100, 450, 150],
			["Enciclopédia Viva", 250, 1000, 350],
			["Arquimago do Conhecimento", 500, 2000, 700],
		],
		["common", "uncommon", "rare", "rare", "epic", "legendary"],
		"questões únicas acertadas de primeira, sem auxílio.",
	),
	...group(
		"licoes",
		"lessons",
		[
			["A Jornada Começa", 1, 30, 15],
			["Pequenos Passos", 5, 90, 35],
			["Estudante Dedicado", 10, 180, 70],
			["Conhecimento Crescente", 25, 400, 140],
			["Mestre das Trilhas", 50, 850, 300],
			["Grande Erudito", 100, 2000, 750],
		],
		["common", "uncommon", "rare", "rare", "epic", "legendary"],
		"lições distintas concluídas com participação válida.",
	),
	...group(
		"perfeicao",
		"perfect",
		[["Execução Perfeita", 1, 50, 25]],
		["uncommon"],
		"lição perfeita: tudo de primeira, sem pulos ou itens de auxílio.",
	),
	...group(
		"perfeicao",
		"bestPerfectRun",
		[
			["Sem Tropeços", 3, 150, 60],
			["Impecável", 5, 300, 120],
			["Mestre da Precisão", 10, 750, 300],
			["Lenda da Perfeição", 20, 1800, 700],
		],
		["rare", "rare", "epic", "legendary"],
		"lições distintas perfeitas seguidas.",
	),
	...group(
		"revisao",
		"reviews",
		[
			["Segunda Chance", 1, 40, 15],
			["Aprendi com o Erro", 3, 100, 35],
			["Especialista em Revisão", 10, 300, 110],
			["Mestre da Superação", 25, 700, 250],
		],
		["common", "uncommon", "rare", "epic"],
		"lições com ao menos um erro e toda a revisão recuperada, sem auxílio.",
	),
	...group(
		"revisao",
		"recovered",
		[["Caçador de Dúvidas", 10, 100, 40]],
		["uncommon"],
		"questões distintas recuperadas na segunda tentativa, sem auxílio.",
	),
	...group(
		"exploracao",
		"trails",
		[
			["Explorador de Trilhas", 1, 200, 70],
			["Viajante do Conhecimento", 3, 600, 200],
		],
		["rare", "epic"],
		"trilhas completas, incluindo todos os pontos previstos.",
	),
	...group(
		"exploracao",
		"disciplines",
		[["Especialista", 1, 350, 120]],
		["epic"],
		"disciplina concluída. Neste catálogo, cada disciplina corresponde a uma trilha completa.",
	),
	...group(
		"exploracao",
		"materials",
		[
			["Leitor Curioso", 5, 80, 30],
			["Guardião da Biblioteca", 25, 300, 110],
		],
		["uncommon", "epic"],
		"materiais distintos concluídos com tempo de leitura e verificação de compreensão.",
	),
] as const;
export type Achievement = (typeof achievements)[number];
export const items = [
	{
		id: "life-drop",
		name: "Gota de Vida",
		price: 25,
		rarity: "common",
		category: "consumiveis",
		kind: "consumable",
		max: 20,
		description:
			"Repõe 1 vida durante a rodada normal de uma atividade em andamento. Limite de 5 vidas; não revive uma atividade perdida.",
	},
	{
		id: "life-potion",
		name: "Poção de Vida",
		price: 65,
		rarity: "uncommon",
		category: "consumiveis",
		kind: "consumable",
		max: 20,
		description:
			"Repõe até 3 vidas na rodada normal, sem ultrapassar 5. Use antes de as vidas acabarem; não é necessária na revisão.",
	},
	{
		id: "life-elixir",
		name: "Elixir de Fôlego",
		price: 95,
		rarity: "rare",
		category: "consumiveis",
		kind: "consumable",
		max: 20,
		description:
			"Completa as vidas de uma atividade em andamento até 5. Não apaga erros ou dá acertos e não revive atividade perdida.",
	},
	{
		id: "streak-shield",
		name: "Escudo da Ofensiva",
		price: 140,
		rarity: "rare",
		category: "ofensiva",
		kind: "consumable",
		max: 3,
		description:
			"Ative antes de precisar: protege um dia perdido, sem somar estudo ou recompensas. Não cobre dias consecutivos.",
	},
	{
		id: "question-pass",
		name: "Passe de Questão",
		price: 100,
		rarity: "rare",
		category: "consumiveis",
		kind: "consumable",
		max: 20,
		description:
			"Pula uma questão compatível. Vale zero acerto, encerra a sequência e impede lição perfeita. Exige confirmação.",
	},
	{
		id: "hint-scroll",
		name: "Pergaminho da Dica",
		price: 35,
		rarity: "common",
		category: "auxilio",
		kind: "consumable",
		max: 20,
		description:
			"Revela uma orientação contextual cadastrada, sem entregar a resposta. Só consome quando há dica válida.",
	},
	{
		id: "answer-lens",
		name: "Lente das Alternativas",
		price: 65,
		rarity: "uncommon",
		category: "auxilio",
		kind: "consumable",
		max: 20,
		description:
			"Retira até duas opções incorretas, mantendo ao menos duas. Não funciona em perguntas com duas alternativas.",
	},
	{
		id: "example-scroll",
		name: "Pergaminho do Exemplo",
		price: 50,
		rarity: "uncommon",
		category: "auxilio",
		kind: "consumable",
		max: 20,
		description:
			"Abre um exemplo adicional validado sobre a habilidade. O conteúdo básico continua gratuito.",
	},
	{
		id: "challenge-swap",
		name: "Troca de Desafio",
		price: 110,
		rarity: "rare",
		category: "auxilio",
		kind: "consumable",
		max: 20,
		description:
			"Troca a questão por uma variante da mesma habilidade e dificuldade. Não cria tentativas extras.",
	},
	{
		id: "tactical-delay",
		name: "Adiamento Tático",
		price: 45,
		rarity: "common",
		category: "consumiveis",
		kind: "consumable",
		max: 20,
		description:
			"Deixa a questão para o fim da primeira rodada, antes da revisão. Uma vez por questão; responder continua obrigatório.",
	},
	{
		id: "arcane-frame",
		name: "Moldura Arcana",
		price: 160,
		rarity: "epic",
		category: "cosmeticos",
		kind: "permanent",
		max: 1,
		description:
			"Desbloqueia uma moldura luminosa para o avatar. Você pode equipar ou retirar quando quiser.",
	},
	{
		id: "stellar-path",
		name: "Caminho Estelar",
		price: 220,
		rarity: "epic",
		category: "cosmeticos",
		kind: "permanent",
		max: 1,
		description:
			"Um acabamento estelar para o mapa. Muda a aparência e preserva todos os bloqueios e progressos.",
	},
	{
		id: "bito-companion",
		name: "Companheiro do Bito",
		price: 300,
		rarity: "legendary",
		category: "especiais",
		kind: "permanent",
		max: 1,
		description:
			"Um pequeno robô acompanha áreas de exploração. Fica fora das lições e pode ser desativado na Mochila.",
	},
] as const;
export type ItemId = (typeof items)[number]["id"];
export type ShopItem = (typeof items)[number];
export const maxLevel = 1000;
export const xpForLevel = (level: number) => (level - 1) ** 2 * 100;

export function levelForXp(xp: number) {
	const level = Math.min(
		maxLevel,
		Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1,
	);
	const start = xpForLevel(level);
	const next = level === maxLevel ? null : xpForLevel(level + 1);
	return { level, start, next };
}

export function levelProgress(xp: number) {
	const { level, start, next } = levelForXp(xp);
	return {
		level,
		start,
		next,
		earned: Math.max(0, xp - start),
		remaining: next === null ? 0 : Math.max(0, next - xp),
		percent:
			next === null ? 100 : (Math.max(0, xp - start) / (next - start)) * 100,
	};
}

const studyRewards = [
	"hint-scroll",
	"example-scroll",
	"answer-lens",
	"tactical-delay",
] as const;

export function rewardsForLevel(level: number): readonly ItemId[] {
	if (level % 25 === 0)
		return ["life-elixir", "streak-shield", "example-scroll"];
	if (level % 10 === 0) return ["life-elixir", "streak-shield"];
	if (level % 5 === 0) return ["life-elixir"];
	return [studyRewards[(level - 1) % studyRewards.length] ?? "hint-scroll"];
}
export function studyDay(now: Date) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(now);
}
export const dayIndex = (day: string) =>
	Math.floor(Date.parse(`${day}T00:00:00Z`) / 86400000);
export const dayAt = (index: number) =>
	new Date(index * 86400000).toISOString().slice(0, 10);
export function studyRuns(
	days: readonly string[],
	protectedDays: readonly string[],
	today: string,
) {
	const actual = new Set(days);
	const protectedSet = new Set(protectedDays);
	const ordered = [...new Set([...days, ...protectedDays])].sort();
	let run = 0,
		best = 0,
		last = -Infinity;
	for (const day of ordered) {
		const index = dayIndex(day);
		if (index !== last + 1) run = 0;
		if (actual.has(day)) run++;
		else if (!protectedSet.has(day) || protectedSet.has(dayAt(index - 1)))
			run = 0;
		best = Math.max(best, run);
		last = index;
	}
	return { current: dayIndex(today) - last <= 1 ? run : 0, best };
}
export type ProgressEvent =
	| { kind: "answer"; round: 1 | 2; correct: boolean; assisted: boolean }
	| { kind: "lesson"; perfect: boolean; review: boolean }
	| { kind: "break" }
	| { kind: "study"; current: number; best: number }
	| { kind: "material" }
	| { kind: "tracks"; count: number };
export function advanceStats(previous: Stats, event: ProgressEvent): Stats {
	const s = { ...previous };
	if (event.kind === "answer") {
		if (event.round === 1) {
			if (event.correct && !event.assisted) {
				s.correct++;
				s.combo++;
				s.bestCombo = Math.max(s.bestCombo, s.combo);
			} else s.combo = 0;
		} else if (event.correct && !event.assisted) s.recovered++;
	}
	if (event.kind === "break") s.combo = 0;
	if (event.kind === "lesson") {
		s.lessons++;
		if (event.perfect) {
			s.perfect++;
			s.perfectRun++;
			s.bestPerfectRun = Math.max(s.bestPerfectRun, s.perfectRun);
		} else s.perfectRun = 0;
		if (event.review) s.reviews++;
	}
	if (event.kind === "study") {
		s.studyStreak = event.current;
		s.bestStudyStreak = Math.max(s.bestStudyStreak, event.best);
	}
	if (event.kind === "material") s.materials++;
	if (event.kind === "tracks") {
		s.trails = event.count;
		s.disciplines = event.count;
	}
	return s;
}
