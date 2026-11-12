import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pointSchema } from "./esquema-conteudo.mjs";

const directory = new URL("../conteudos/elementar/", import.meta.url);
const importRequested = process.argv.slice(2).join(" ") === "--importar";
if (process.argv.length > 2 && !importRequested)
	throw new Error(
		"Use sem argumentos para validar, ou --importar para publicar.",
	);
const files = await Promise.all(
	Array.from({ length: 60 }, async (_, i) =>
		pointSchema.parse(
			JSON.parse(
				await readFile(
					new URL(`${String(i + 1).padStart(2, "0")}.json`, directory),
					"utf8",
				),
			),
		),
	),
);
for (const [i, f] of files.entries())
	if (f.trilha !== "elementar" || f.ponto !== i + 1)
		throw new Error("Sequência de passos inválida.");
console.log("Validados 60 passos antes de qualquer gravação.");

const modes = { conteudo: "CONTENT", questao: "QUESTION", mista: "MIXED" };
const types = {
	"multipla-escolha": "MULTIPLE_CHOICE",
	associacao: "ASSOCIATION",
	ligacao: "PAIR_LINKS",
	"passo-a-passo": "WALKTHROUGH",
};
const dataOf = (entry) => {
	const { tipo, enunciado, recurso, gabarito, ...payload } =
		entry.questao ?? {};
	return {
		number: entry.numero,
		position: entry.ordem ?? null,
		mode: modes[entry.modo],
		type: tipo ? types[tipo] : null,
		prompt: enunciado ?? null,
		media: recurso ?? null,
		payload: tipo ? payload : null,
		answer: gabarito ?? null,
		content: entry.conteudo ?? null,
	};
};
const canonical = (value) =>
	JSON.stringify(value, (_, v) =>
		v && typeof v === "object" && !Array.isArray(v)
			? Object.fromEntries(
					Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
				)
			: v,
	);

if (importRequested) {
	try {
		process.loadEnvFile();
	} catch (e) {
		if (e.code !== "ENOENT") throw e;
	}
	const { PrismaClient } = await import("../generated/prisma/index.js");
	const db = new PrismaClient();
	try {
		await db.$transaction(
			async (tx) => {
				await tx.$executeRaw`SELECT pg_advisory_xact_lock(1001,60)`;
				const catalog =
					await tx.$queryRaw`SELECT p.number,a.id,a.slug,a.title FROM "TrailPoint" p JOIN "LearningActivity" a ON a."pointId"=p.id WHERE p."trailSlug"='elementar' ORDER BY p.number,a.id`;
				const entries =
					await tx.$queryRaw`SELECT p.number AS point,a.slug,e.* FROM "TrailPoint" p JOIN "LearningActivity" a ON a."pointId"=p.id JOIN "LearningEntry" e ON e."activityId"=a.id WHERE p."trailSlug"='elementar' ORDER BY p.number,a.id,e.number`;
				const content =
					await tx.$queryRaw`SELECT p.number,c.* FROM "TrailPoint" p JOIN "TrailPointContent" c ON c."pointId"=p.id WHERE p."trailSlug"='elementar' ORDER BY p.number`;
				const oldKeys = new Map(
					catalog.map((a) => [`${a.number}:${a.slug}`, a]),
				);
				const same =
					catalog.length === 60 &&
					content.length === 0 &&
					files.every((f) =>
						f.atividades.every((a) => {
							if (oldKeys.get(`${f.ponto}:${a.id}`)?.title !== a.titulo)
								return false;
							const existing = entries
								.filter((e) => e.point === f.ponto && e.slug === a.id)
								.map(({ activityId, point, slug, ...entry }) => entry);
							return canonical(existing) === canonical(a.questoes.map(dataOf));
						}),
					);
				if (same) {
					console.log(
						"Catálogo já contém esta versão; nenhuma gravação necessária.",
					);
					return;
				}
				const [usage] =
					await tx.$queryRaw`SELECT (SELECT count(*) FROM "LearningPointProgress" l JOIN "TrailPoint" p ON p.id=l."pointId" WHERE p."trailSlug"='elementar')::int AS progress,(SELECT count(*) FROM "MaterialReading" m JOIN "TrailPoint" p ON p.id=m."pointId" WHERE p."trailSlug"='elementar')::int AS readings,(SELECT count(*) FROM "RpgQuestionState" q JOIN "TrailPoint" p ON p.id=q."pointId" WHERE p."trailSlug"='elementar')::int AS supports`;
				const backupDirectory = new URL("backups/", directory);
				await mkdir(backupDirectory, { recursive: true });
				const backup = new URL(
					`catalogo-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
					backupDirectory,
				);
				await writeFile(
					backup,
					JSON.stringify({ catalog, entries, content }, null, 2) + "\n",
				);
				console.log(`Backup do catálogo anterior: ${fileURLToPath(backup)}`);
				if (usage.progress || usage.readings || usage.supports) {
					const archiveSlug = "elementar-v1-20261112";
					const priorArchive =
						await tx.$queryRaw`SELECT slug FROM "LearningTrail" WHERE slug=${archiveSlug}`;
					if (priorArchive.length)
						throw new Error(
							"Já existe um arquivo da distribuição anterior. Uma nova alteração com progresso exige outra versão de arquivo.",
						);
					await tx.$executeRaw`INSERT INTO "LearningTrail" (slug,name,archived) VALUES (${archiveSlug},'Matemática Elementar · versão anterior',true)`;
					await tx.$executeRaw`UPDATE "TrailPoint" SET "trailSlug"=${archiveSlug} WHERE "trailSlug"='elementar'`;
					console.log(
						`Versão anterior arquivada com ${usage.progress} registros de progresso. IDs, tentativas, conclusões, XP, leituras e auxílios foram preservados.`,
					);
				}
				await tx.$executeRaw`INSERT INTO "LearningTrail" (slug,name) VALUES ('elementar','Matemática Elementar') ON CONFLICT (slug) DO NOTHING`;
				for (const f of files) {
					await tx.$executeRaw`INSERT INTO "TrailPoint" ("trailSlug",number) VALUES ('elementar',${f.ponto}) ON CONFLICT ("trailSlug",number) DO NOTHING`;
					const [point] =
						await tx.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=${f.ponto}`;
					await tx.$executeRaw`DELETE FROM "TrailPointContent" WHERE "pointId"=${point.id}`;
					for (const a of f.atividades) {
						await tx.$executeRaw`DELETE FROM "LearningActivity" WHERE "pointId"=${point.id} AND slug<>${a.id}`;
						const [saved] =
							await tx.$queryRaw`INSERT INTO "LearningActivity" ("pointId",slug,title) VALUES (${point.id},${a.id},${a.titulo}) ON CONFLICT ("pointId",slug) DO UPDATE SET title=EXCLUDED.title RETURNING id`;
						for (const e of a.questoes) {
							const d = dataOf(e);
							await tx.$executeRaw`INSERT INTO "LearningEntry" ("activityId",number,position,mode,type,prompt,media,payload,answer,content) VALUES (${saved.id},${d.number},${d.position},${d.mode}::"LearningEntryMode",${d.type}::"LearningQuestionType",${d.prompt},${d.media === null ? null : JSON.stringify(d.media)}::jsonb,${d.payload === null ? null : JSON.stringify(d.payload)}::jsonb,${d.answer === null ? null : JSON.stringify(d.answer)}::jsonb,${d.content === null ? null : JSON.stringify(d.content)}::jsonb) ON CONFLICT ("activityId",number) DO UPDATE SET position=EXCLUDED.position,mode=EXCLUDED.mode,type=EXCLUDED.type,prompt=EXCLUDED.prompt,media=EXCLUDED.media,payload=EXCLUDED.payload,answer=EXCLUDED.answer,content=EXCLUDED.content`;
						}
						await tx.$executeRaw`DELETE FROM "LearningEntry" WHERE "activityId"=${saved.id} AND number>17`;
					}
				}
				console.log(
					"Publicados 60 passos em uma transação, sem alterar as outras trilhas.",
				);
			},
			{ isolationLevel: "Serializable", timeout: 120000 },
		);
	} finally {
		await db.$disconnect();
	}
}
