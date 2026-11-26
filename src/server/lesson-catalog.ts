import "server-only";
import { cache } from "react";
import { publishedCatalogCache } from "./catalog-cache";
import { db } from "./db";
import { type Entry, isGraded, toStageModel } from "./lesson-content";

async function readLesson(pointId: number) {
	const [content, rows] = await Promise.all([
		db.$queryRaw<{ blocks: unknown; summary: string | null }[]>`
			SELECT blocks, summary FROM "TrailPointContent" WHERE "pointId" = ${pointId}
		`,
		db.$queryRaw<Entry[]>`
			SELECT a.id::text || '-' || e.number::text AS key, a.title, e.type, e.prompt, e.media, e.payload, e.answer, e.content
			FROM "LearningActivity" a JOIN "LearningEntry" e ON e."activityId" = a.id
			WHERE a."pointId" = ${pointId} ORDER BY a.id, COALESCE(e.position, e.number), e.number
		`,
	]);
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
}

export const getLessonCatalog = cache((pointId: number) =>
	publishedCatalogCache(`lesson-catalog-v2:${pointId}`, async () => {
		const entries = await readLesson(pointId);
		const screens = entries.map((entry) => ({
			key: entry.key,
			title: entry.title,
			model: toStageModel(entry),
			graded: isGraded(entry),
		}));
		const materials = screens.flatMap(({ key, title, model }) =>
			"content" in model && model.content.category === "material"
				? [{ key, title: model.content.title ?? title, content: model.content }]
				: [],
		);
		return { entries, screens, materials };
	}),
);

export async function getLesson(pointId: number) {
	return (await getLessonCatalog(pointId)).entries;
}
