import "server-only";

import { cache } from "react";
import { z } from "zod";
import type {
	Activity,
	ContentBlock,
	StageContent,
	StageModel,
} from "~/app/aprender/_etapa/model";
import {
	diagramBlock,
	formulaBlock,
	resourceBlock,
	sectionFields,
} from "~/app/aprender/_etapa/pedagogy.mjs";
import type { TrailId } from "~/app/aprender/trails";
import { livesOf } from "~/domain/lesson-lives.mjs";
import { db } from "~/server/db";
import {
	getLearningRecords,
	getPublishedPoints,
	getTrailStatus,
} from "./learning";
import {
	type Attempt,
	advanceLesson,
	type LessonProgress,
	lessonProgressPercent,
	type PendingItem,
	pendingItem,
} from "./lesson-progress";
import { persistLesson } from "./lesson-state";
import { ensureRpg, lockWallet, registerAnswerRpg } from "./rpg";
import { effectiveEntry, getQuestionState } from "./rpg-support";

const block = z.discriminatedUnion("tipo", [
	z.object({ tipo: z.literal("titulo"), id: z.string(), texto: z.string() }),
	z.object({ tipo: z.literal("texto"), id: z.string(), texto: z.string() }),
	z.object({
		tipo: z.literal("imagem"),
		id: z.string(),
		src: z.string().regex(/^(?:\/(?!\/)[^\\\s]+|https:\/\/[^\\\s]+)$/i),
		alt: z.string(),
		largura: z.number().positive(),
		altura: z.number().positive(),
		legenda: z.string().optional(),
	}),
	z.object({
		tipo: z.literal("montagem"),
		id: z.string(),
		componente: z.string(),
	}),
	diagramBlock,
	formulaBlock,
	resourceBlock,
]);
const item = z.object({ id: z.string(), texto: z.string() });
const entries = z.array(item);
const paired = z.object({ itens: entries, alternativas: entries });
const pairs = z
	.array(z.object({ origem: z.string(), destino: z.string() }))
	.min(1);
const walkthrough = z.object({
	passos: z.array(
		z.object({
			id: z.string(),
			titulo: z.string(),
			blocos: z.array(z.unknown()),
		}),
	),
});
const reading = z.object({
	blocos: z.array(z.unknown()),
	resumo: z.string().nullish(),
	...sectionFields,
});

function contentOf(data: unknown): StageContent {
	const result = reading.safeParse(data);
	if (!result.success) return { blocks: [] };
	const blocks = result.data.blocos.flatMap((raw): ContentBlock[] => {
		const result = block.safeParse(raw);
		if (!result.success) return [];
		const value = result.data;
		switch (value.tipo) {
			case "titulo":
				return [{ id: value.id, type: "heading", text: value.texto }];
			case "texto":
				return [{ id: value.id, type: "text", text: value.texto }];
			case "imagem":
				return [
					{
						id: value.id,
						type: "image",
						src: value.src,
						alt: value.alt,
						width: value.largura,
						height: value.altura,
						caption: value.legenda,
					},
				];
			case "montagem":
				return [
					{
						id: value.id,
						type: "text",
						text: `Recurso interativo em preparação · ${value.componente}`,
					},
				];
			case "diagrama":
				return [
					{
						id: value.id,
						type: "diagram",
						caption: value.legenda,
						data: value.dados,
					},
				];
			case "formula":
				return [
					{
						id: value.id,
						type: "formula",
						label: value.leitura,
						terms: value.termos,
					},
				];
			case "referencia":
				return [
					{
						id: value.id,
						type: "resource",
						title: value.titulo,
						source: value.fonte,
						url: value.url,
					},
				];
			default:
				return [];
		}
	});
	return {
		blocks,
		summary: result.data.resumo ?? undefined,
		title: result.data.titulo,
		category: result.data.categoria,
	};
}

export type Entry = {
	key: string;
	title: string;
	type: "MULTIPLE_CHOICE" | "ASSOCIATION" | "PAIR_LINKS" | "WALKTHROUGH" | null;
	prompt: string | null;
	media: unknown;
	payload: unknown;
	answer: unknown;
	content: unknown;
};

export const getLesson = cache(async (pointId: number) => {
	const content = await db.$queryRaw<
		{ blocks: unknown; summary: string | null }[]
	>`
		SELECT blocks, summary FROM "TrailPointContent" WHERE "pointId" = ${pointId}
	`;
	const rows = await db.$queryRaw<Entry[]>`
		SELECT a.id::text || '-' || e.number::text AS key, a.title, e.type, e.prompt, e.media, e.payload, e.answer, e.content
		FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId" = a.id
		WHERE a."pointId" = ${pointId} ORDER BY a.id, COALESCE(e.position, e.number), e.number
	`;
	const first = content[0];
	if (!first) return rows;
	return [
		{
			key: "leitura",
			title: "Leitura da etapa",
			type: null,
			prompt: null,
			media: null,
			payload: null,
			answer: null,
			content: { blocos: first.blocks, resumo: first.summary },
		},
		...rows,
	];
});

const labels = (items: z.infer<typeof entries>) =>
	items.map(({ id, texto }) => ({ id, label: texto }));

export function toStageModel(entry: Entry): StageModel {
	const props = { title: entry.title, prompt: entry.prompt ?? undefined };
	let activity: Activity | undefined;
	switch (entry.type) {
		case "MULTIPLE_CHOICE": {
			const data = z.object({ alternativas: entries }).parse(entry.payload);
			activity = {
				...props,
				kind: "multipla-escolha",
				choices: labels(data.alternativas),
			};
			break;
		}
		case "ASSOCIATION":
		case "PAIR_LINKS": {
			const data = paired.parse(entry.payload);
			activity =
				entry.type === "ASSOCIATION"
					? {
							...props,
							kind: "associacao",
							items: labels(data.itens),
							options: labels(data.alternativas),
						}
					: {
							...props,
							kind: "ligacao",
							sources: labels(data.itens),
							targets: labels(data.alternativas),
						};
			break;
		}
		case "WALKTHROUGH": {
			const data = walkthrough.parse(entry.payload);
			activity = {
				...props,
				kind: "passo-a-passo",
				steps: data.passos.map((step) => ({
					id: step.id,
					title: step.titulo,
					blocks: contentOf({ blocos: step.blocos }).blocks,
				})),
			};
			break;
		}
	}
	const content = contentOf(entry.content);
	if (entry.media && typeof entry.media === "object") {
		content.blocks = [
			...content.blocks,
			...contentOf({ blocos: [{ ...entry.media, id: "recurso-da-questao" }] })
				.blocks,
		];
	}
	if (!activity) return { mode: "conteudo", content };
	return content.blocks.length || content.summary
		? { mode: "mista", content, activity }
		: { mode: "atividade", activity };
}

export function isGraded(entry: Entry) {
	return entry.type !== null && entry.type !== "WALKTHROUGH";
}

const metadata = z.object({
	assunto: z.string().optional(),
	orientacao: z.string().optional(),
	explicacao: z.string().optional(),
});

const details = (entry: Entry) => metadata.safeParse(entry.payload).data;

export function lessonItems(lesson: Entry[]) {
	return lesson.map((entry) => ({
		key: entry.key,
		graded: isGraded(entry),
		topic: details(entry)?.assunto ?? entry.title,
	}));
}

function grade(entry: Entry, form: FormData): Attempt | undefined {
	if (entry.type === "MULTIPLE_CHOICE") {
		const data = z.object({ alternativas: entries }).parse(entry.payload);
		const selected = form.getAll("resposta");
		const [value] = selected;
		if (
			selected.length !== 1 ||
			typeof value !== "string" ||
			!data.alternativas.some(({ id }) => id === value)
		)
			return;
		return { correct: value === entry.answer, selection: [value] };
	}

	const { itens, alternativas } = paired.parse(entry.payload);
	const expected = pairs.parse(entry.answer);
	const selection: string[] = [];
	for (const { id } of itens) {
		const values = form.getAll(`resposta:${id}`);
		const [value] = values;
		if (
			values.length !== 1 ||
			typeof value !== "string" ||
			!alternativas.some((option) => option.id === value)
		)
			return;
		selection.push(value);
	}
	if (
		entry.type === "PAIR_LINKS" &&
		new Set(selection).size !== selection.length
	)
		return;
	return {
		correct: itens.every(({ id }, index) =>
			expected.some(
				({ origem, destino }) => origem === id && destino === selection[index],
			),
		),
		selection,
	};
}

export function feedbackFor(entry: Entry, attempt: Attempt, round: 1 | 2) {
	const data = z
		.object({ alternativas: entries, itens: entries.optional() })
		.parse(entry.payload);
	const label = (id: unknown) =>
		data.alternativas.find((option) => option.id === id)?.texto ?? "";
	const chosen = attempt.selection.map((id, index) => ({
		id: data.itens?.[index]?.id ?? id,
		label: data.itens?.[index]?.texto,
		value: label(id),
	}));
	const solution =
		attempt.correct || round === 1
			? []
			: typeof entry.answer === "string"
				? [{ id: entry.answer, label: undefined, value: label(entry.answer) }]
				: pairs.parse(entry.answer).map(({ origem, destino }) => ({
						id: origem,
						label: data.itens?.find(({ id }) => id === origem)?.texto,
						value: label(destino),
					}));
	const info = details(entry);
	return {
		chosen,
		solution,
		explanation: attempt.correct || round === 2 ? info?.explicacao : undefined,
		hint:
			!attempt.correct && round === 1
				? (info?.orientacao ??
					"Na revisão, releia o enunciado e confira cada condição antes de responder.")
				: undefined,
	};
}

export async function recordAnswer(
	userId: string,
	trail: TrailId,
	number: number,
	submission: PendingItem,
	form: FormData,
) {
	const [points, progress] = await Promise.all([
		getPublishedPoints(),
		getLearningRecords(userId),
	]);
	if (!points || !progress)
		return { error: "O progresso está indisponível. Tente novamente." };
	const { published, completed, next } = getTrailStatus(
		points,
		progress,
		trail,
	);
	const point = published.find((point) => point.number === number);
	if (!point || (point.id !== next?.id && !completed.includes(point))) {
		return { error: "Conclua a etapa disponível no mapa para continuar." };
	}
	const entries = await getLesson(point.id);
	const original = entries.find((entry) => entry.key === submission.key);
	if (!original)
		return { error: "A etapa mudou. Atualize a página antes de continuar." };
	let entry: Entry = original;
	const items = lessonItems(entries);
	await ensureRpg(userId);
	const assessment = (
		answer: Attempt,
		state: LessonProgress,
		finished: boolean,
	) => ({
		...feedbackFor(entry, answer, submission.round),
		correct: answer.correct,
		round: submission.round,
		selection: answer.selection,
		finished,
		lives: livesOf(state),
		failed: livesOf(state) === 0,
		progress: lessonProgressPercent(items, state, submission.round),
		eventId: `answer:${userId}:${point.id}:${entry.key}:${submission.round}:run-${state.run ?? 1}`,
	});

	return db.$transaction(
		async (tx) => {
			await lockWallet(tx, userId);
			const support = await getQuestionState(
				userId,
				point.id,
				submission.key,
				tx,
			);
			entry = effectiveEntry(original as Entry, support.effects);
			if (
				(form.get("variant") ?? "") !== (support.effects.replacement?.key ?? "")
			)
				return {
					error:
						"A questão foi atualizada. Atualize a tela antes de responder.",
				};
			const attempt = isGraded(entry) ? grade(entry, form) : undefined;
			if (isGraded(entry) && !attempt)
				return { error: "Preencha todos os campos da questão para responder." };
			if (entry.type === "WALKTHROUGH" && form.get("resposta") !== "concluido")
				return { error: "Percorra todos os passos antes de continuar." };

			if (attempt) {
				if (
					attempt.selection.some((id) => support.effects.removed?.includes(id))
				)
					return { error: "Uma alternativa removida não pode ser enviada." };
				attempt.assisted = support.assisted;
			}
			await tx.$executeRaw`
			INSERT INTO "LearningPointProgress" ("userId", "pointId") VALUES (${userId}, ${point.id})
			ON CONFLICT ("userId", "pointId") DO NOTHING
		`;
			const [row] = await tx.$queryRaw<
				(LessonProgress & { completedAt: Date | null })[]
			>`
			SELECT "completedEntries", attempts, "skippedEntries", "deferredEntries", "completedAt", lives, run FROM "LearningPointProgress"
			WHERE "userId" = ${userId} AND "pointId" = ${point.id} FOR UPDATE
		`;
			if (!row)
				return { error: "O progresso está indisponível. Tente novamente." };
			if (Number(form.get("run") ?? 1) !== (row.run ?? 1))
				return {
					error:
						"A atividade foi recomeçada. Atualize a tela antes de responder.",
				};
			const saved = row.attempts[submission.key]?.[submission.round - 1];
			if (saved) {
				const same =
					attempt &&
					saved.selection.length === attempt.selection.length &&
					saved.selection.every(
						(value, index) => value === attempt.selection[index],
					);
				return same
					? {
							feedback: true,
							assessment: assessment(saved, row, Boolean(row.completedAt)),
							nextKey: pendingItem(items, row)?.key,
						}
					: { error: "A resposta desta rodada já foi registrada." };
			}
			if (row.completedAt) return { finished: true };
			if (livesOf(row) === 0)
				return {
					error: "As vidas acabaram. Recomece a atividade para continuar.",
				};
			const updated = advanceLesson(items, row, submission, attempt);
			if (!updated) {
				if (!isGraded(entry) && row.completedEntries.includes(submission.key))
					return { continued: true };
				return {
					error:
						"Esta tela já avançou ou pertence a outra rodada. Atualize a lição para continuar.",
				};
			}
			const awards = attempt
				? await registerAnswerRpg(
						tx,
						userId,
						point.id,
						submission.key,
						submission.round,
						attempt.correct,
						Boolean(attempt.assisted),
					)
				: [];
			const persisted = await persistLesson(
				tx,
				userId,
				point.id,
				updated,
				items,
				point.reward,
			);
			const upcoming = persisted.pending;
			awards.push(...persisted.awards);
			return attempt
				? {
						feedback: true,
						assessment: assessment(attempt, updated, persisted.finished),
						nextKey: upcoming?.key,
						awards,
					}
				: { continued: true, nextKey: upcoming?.key, awards };
		},
		{ timeout: 15000 },
	);
}
