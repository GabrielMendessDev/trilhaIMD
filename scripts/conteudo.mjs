import { readFile } from "node:fs/promises";
import { pointSchema } from "./esquema-conteudo.mjs";

const modes = { conteudo: "CONTENT", questao: "QUESTION", mista: "MIXED" };
const types = {
	"multipla-escolha": "MULTIPLE_CHOICE",
	associacao: "ASSOCIATION",
	ligacao: "PAIR_LINKS",
	"passo-a-passo": "WALKTHROUGH",
};

function entryData(entry, dbNull) {
	const { tipo, enunciado, recurso, gabarito, ...payload } =
		entry.questao ?? {};
	return {
		mode: modes[entry.modo],
		position: entry.ordem ?? null,
		type: tipo ? types[tipo] : null,
		prompt: enunciado ?? null,
		media: recurso ?? dbNull,
		payload: tipo ? payload : dbNull,
		answer: gabarito ?? dbNull,
		content: entry.conteudo ?? dbNull,
	};
}

async function savePoint(tx, file, dbNull) {
	const point = await tx.trailPoint.findUnique({
		where: { trailSlug_number: { trailSlug: file.trilha, number: file.ponto } },
		select: { id: true },
	});
	if (!point)
		throw new Error(
			`O ponto ${file.ponto} da trilha "${file.trilha}" não existe no banco.`,
		);

	if (file.conteudo) {
		const content = {
			blocks: file.conteudo.blocos,
			summary: file.conteudo.resumo ?? null,
		};
		await tx.trailPointContent.upsert({
			where: { pointId: point.id },
			create: { pointId: point.id, ...content },
			update: content,
		});
	}

	for (const activity of file.atividades) {
		const saved = await tx.learningActivity.upsert({
			where: { pointId_slug: { pointId: point.id, slug: activity.id } },
			create: { pointId: point.id, slug: activity.id, title: activity.titulo },
			update: { title: activity.titulo },
			select: { id: true },
		});
		const activityId = saved.id;

		for (const entry of activity.questoes) {
			const data = entryData(entry, dbNull);
			await tx.learningEntry.upsert({
				where: { activityId_number: { activityId, number: entry.numero } },
				create: { activityId, number: entry.numero, ...data },
				update: data,
			});
		}
		await tx.learningEntry.deleteMany({
			where: {
				activityId,
				number: { notIn: activity.questoes.map(({ numero }) => numero) },
			},
		});
	}
}

async function importPoint(file) {
	try {
		process.loadEnvFile();
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	if (!process.env.DATABASE_URL)
		throw new Error("Configure DATABASE_URL antes de importar.");

	const { Prisma, PrismaClient } = await import("../generated/prisma/index.js");
	const db = new PrismaClient();
	try {
		if (!db.trailPoint)
			throw new Error(
				"Gere o cliente Prisma atualizado com npx prisma generate.",
			);
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				await db.$transaction((tx) => savePoint(tx, file, Prisma.DbNull), {
					isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
					timeout: 30_000,
				});
				return;
			} catch (error) {
				if (error.code !== "P2034" || attempt === 3) throw error;
			}
		}
	} finally {
		await db.$disconnect();
	}
}

async function main() {
	const [command, path, ...extra] = process.argv.slice(2);
	if (!["validar", "importar"].includes(command) || !path || extra.length) {
		throw new Error(
			"Uso: npm run conteudo:validar -- arquivo.json ou npm run conteudo:importar -- arquivo.json",
		);
	}

	const input = (await readFile(path, "utf8")).replace(/^\uFEFF/, "");
	let json;
	try {
		json = JSON.parse(input);
	} catch {
		throw new Error("O arquivo não contém JSON válido.");
	}
	const result = pointSchema.safeParse(json);
	if (!result.success) {
		throw new Error(
			result.error.issues
				.map(
					({ path, message }) => `${path.join(".") || "arquivo"} — ${message}`,
				)
				.join("\n"),
		);
	}

	const file = result.data;
	if (command === "importar") await importPoint(file);
	const status = command === "importar" ? "Importado" : "Validado";
	console.log(
		`${status} • ${file.trilha}/${file.ponto} • ${file.atividades.length} atividade(s)`,
	);
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
