import { z } from "zod";
import {
	diagramBlock,
	formulaBlock,
	resourceBlock,
	sectionFields,
} from "../src/app/aprender/_etapa/pedagogy.mjs";

const text = z.string().trim().min(1);
const id = z
	.string()
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Use um identificador em minúsculas, separado por hífens.",
	);
const integer = z.number().int().min(1).max(2_147_483_647);
const image = z
	.object({
		tipo: z.literal("imagem"),
		src: z
			.string()
			.refine(
				(src) => /^(?:\/(?!\/)[^\\\s]+|https:\/\/[^\\\s]+)$/i.test(src),
				"Use um caminho público local ou um URL HTTPS.",
			),
		alt: text,
		largura: integer,
		altura: integer,
		legenda: text.optional(),
	})
	.strict();
const assembly = z
	.object({
		tipo: z.literal("montagem"),
		componente: id,
		dados: z.record(z.unknown()),
	})
	.strict();
const media = z.discriminatedUnion("tipo", [image, assembly]);

const block = z.discriminatedUnion("tipo", [
	z.object({ id, tipo: z.literal("titulo"), texto: text }).strict(),
	z.object({ id, tipo: z.literal("texto"), texto: text }).strict(),
	image.extend({ id }),
	assembly.extend({ id }),
	diagramBlock.extend({ id }),
	formulaBlock.extend({ id }),
	resourceBlock.extend({ id }),
]);

function checkUnique(items, field, ctx) {
	const seen = new Set();
	for (const [index, item] of items.entries()) {
		if (seen.has(item[field])) {
			ctx.addIssue({
				code: "custom",
				path: [index, field],
				message: `Valor duplicado (${item[field]}).`,
			});
		}
		seen.add(item[field]);
	}
}

const blocks = z
	.array(block)
	.min(1)
	.superRefine((items, ctx) => checkUnique(items, "id", ctx));
const content = z
	.object({ blocos: blocks, resumo: text.optional(), ...sectionFields })
	.strict();
const item = z.object({ id, texto: text }).strict();
const itemList = (minimum) =>
	z
		.array(item)
		.min(minimum)
		.superRefine((items, ctx) => checkUnique(items, "id", ctx));
const pair = z.object({ origem: id, destino: id }).strict();
const step = z.object({ id, titulo: text, blocos: blocks }).strict();

const questionFields = {
	enunciado: text,
	recurso: media.optional(),
	assunto: text.optional(),
	orientacao: text.optional(),
	explicacao: text.optional(),
};
const question = z
	.discriminatedUnion("tipo", [
		z
			.object({
				...questionFields,
				tipo: z.literal("multipla-escolha"),
				alternativas: itemList(2),
				gabarito: id,
			})
			.strict(),
		z
			.object({
				...questionFields,
				tipo: z.literal("associacao"),
				itens: itemList(1),
				alternativas: itemList(1),
				gabarito: z.array(pair).min(1),
			})
			.strict(),
		z
			.object({
				...questionFields,
				tipo: z.literal("ligacao"),
				itens: itemList(1),
				alternativas: itemList(1),
				gabarito: z.array(pair).min(1),
			})
			.strict(),
		z
			.object({
				...questionFields,
				tipo: z.literal("passo-a-passo"),
				passos: z
					.array(step)
					.min(2)
					.superRefine((items, ctx) => checkUnique(items, "id", ctx)),
			})
			.strict(),
	])
	.superRefine((value, ctx) => {
		if (value.tipo === "passo-a-passo") return;

		const options = new Set(value.alternativas.map(({ id }) => id));
		if (value.tipo === "multipla-escolha") {
			if (!options.has(value.gabarito)) {
				ctx.addIssue({
					code: "custom",
					path: ["gabarito"],
					message: "O gabarito precisa indicar uma alternativa existente.",
				});
			}
			return;
		}

		const sources = new Set(value.itens.map(({ id }) => id));
		const usedSources = new Set();
		const usedTargets = new Set();
		for (const [index, { origem, destino }] of value.gabarito.entries()) {
			if (!sources.has(origem) || usedSources.has(origem)) {
				ctx.addIssue({
					code: "custom",
					path: ["gabarito", index, "origem"],
					message: "A origem precisa existir e aparecer uma única vez.",
				});
			}
			if (
				!options.has(destino) ||
				(value.tipo === "ligacao" && usedTargets.has(destino))
			) {
				ctx.addIssue({
					code: "custom",
					path: ["gabarito", index, "destino"],
					message:
						"O destino precisa existir. Em ligar pares, use cada destino uma única vez.",
				});
			}
			usedSources.add(origem);
			usedTargets.add(destino);
		}
		if (value.itens.some(({ id }) => !usedSources.has(id))) {
			ctx.addIssue({
				code: "custom",
				path: ["gabarito"],
				message: "Informe uma resposta para cada item de origem.",
			});
		}
	});

const sequence = { numero: integer, ordem: integer.optional() };
const entry = z.discriminatedUnion("modo", [
	z
		.object({ ...sequence, modo: z.literal("conteudo"), conteudo: content })
		.strict(),
	z
		.object({ ...sequence, modo: z.literal("questao"), questao: question })
		.strict(),
	z
		.object({
			...sequence,
			modo: z.literal("mista"),
			conteudo: content,
			questao: question,
		})
		.strict(),
]);

const activity = z
	.object({
		id,
		titulo: text,
		questoes: z.array(entry).superRefine((entries, ctx) => {
			checkUnique(entries, "numero", ctx);
			checkUnique(
				entries.map(({ numero, ordem }) => ({ ordem: ordem ?? numero })),
				"ordem",
				ctx,
			);
			if (entries.filter(({ modo }) => modo !== "conteudo").length < 10) {
				ctx.addIssue({
					code: "custom",
					message:
						"A atividade precisa de pelo menos 10 entradas no modo questao ou mista.",
				});
			}
		}),
	})
	.strict();

export const pointSchema = z
	.object({
		versao: z.literal(1),
		trilha: id,
		ponto: integer,
		conteudo: content.optional(),
		atividades: z
			.array(activity)
			.superRefine((items, ctx) => checkUnique(items, "id", ctx))
			.default([]),
	})
	.strict()
	.superRefine(({ conteudo, atividades }, ctx) => {
		if (!conteudo && atividades.length === 0) {
			ctx.addIssue({
				code: "custom",
				message: "Inclua conteúdo do ponto ou pelo menos uma atividade.",
			});
		}
	});
