import { z } from "zod";

const text = z.string().trim().min(1);
const section = z
	.object({ simbolo: text, nome: text, exemplo: text, fora: text })
	.strict();
export const diagramSchema = z.discriminatedUnion("modelo", [
	z
		.object({
			modelo: z.literal("venn"),
			esquerda: text,
			centro: text,
			direita: text,
		})
		.strict(),
	z
		.object({
			modelo: z.literal("reta"),
			marcas: z.array(text).min(2).max(7),
			destaque: z.number().int().min(0).max(6).optional(),
		})
		.strict(),
	z
		.object({
			modelo: z.literal("inclusao"),
			camadas: z.array(section).min(2).max(5),
			observacao: text,
		})
		.strict(),
	z
		.object({
			modelo: z.literal("quadro"),
			linhas: z
				.array(
					z.object({ simbolo: text, leitura: text, exemplo: text }).strict(),
				)
				.min(2)
				.max(8),
		})
		.strict(),
]);
const term = z.discriminatedUnion("forma", [
	z.object({ forma: z.literal("texto"), valor: text }).strict(),
	z
		.object({ forma: z.literal("fracao"), numerador: text, denominador: text })
		.strict(),
	z.object({ forma: z.literal("raiz"), radicando: text }).strict(),
	z
		.object({ forma: z.literal("potencia"), base: text, expoente: text })
		.strict(),
]);
export const diagramBlock = z
	.object({
		id: text,
		tipo: z.literal("diagrama"),
		legenda: text,
		dados: diagramSchema,
	})
	.strict();
export const formulaBlock = z
	.object({
		id: text,
		tipo: z.literal("formula"),
		leitura: text,
		termos: z.array(term).min(1),
	})
	.strict();
export const resourceBlock = z
	.object({
		id: text,
		tipo: z.literal("referencia"),
		titulo: text,
		fonte: text,
		url: z.string().url().startsWith("https://"),
	})
	.strict();
export const sectionFields = {
	titulo: text.optional(),
	categoria: z.enum(["explicacao", "diagrama", "material"]).optional(),
};
