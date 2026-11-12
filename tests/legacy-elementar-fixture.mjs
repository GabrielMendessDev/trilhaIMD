import assert from "node:assert/strict";
import { PrismaClient } from "../generated/prisma/index.js";

assert.ok(
	process.env.DATABASE_URL &&
		new URL(process.env.DATABASE_URL).hostname === "127.0.0.1",
);
const db = new PrismaClient();
const user = "teste-arquivo-elementar";
try {
	if (process.argv[2] === "preparar") {
		await db.$transaction(async (tx) => {
			const [point] =
				await tx.$queryRaw`SELECT id FROM "TrailPoint" WHERE "trailSlug"='elementar' AND number=1`;
			const [activity] =
				await tx.$queryRaw`INSERT INTO "LearningActivity" ("pointId",slug,title) VALUES (${point.id},'legacy-test','Material anterior de teste') RETURNING id`;
			for (let i = 1; i <= 10; i++)
				await tx.$executeRaw`INSERT INTO "LearningEntry" ("activityId",number,mode,type,prompt,payload,answer) VALUES (${activity.id},${i},'QUESTION','MULTIPLE_CHOICE','Questão anterior',${JSON.stringify(
					{
						alternativas: [
							{ id: "a", texto: "Sim" },
							{ id: "b", texto: "Não" },
						],
					},
				)}::jsonb,'"a"'::jsonb)`;
			await tx.$executeRaw`INSERT INTO "User" (id,name) VALUES (${user},'Histórico de teste')`;
			await tx.$executeRaw`INSERT INTO "LearningPointProgress" ("userId","pointId","completedAt",xp,"correctAnswers") VALUES (${user},${point.id},now(),10,1)`;
			await tx.$executeRaw`INSERT INTO "RpgWallet" ("userId",bits,"achievementXp",stats,initialized) VALUES (${user},77,5,'{}'::jsonb,true)`;
		});
	} else if (process.argv[2] === "conferir") {
		const [history] =
			await db.$queryRaw`SELECT l.xp,l."completedAt",p."trailSlug",t.archived,w.bits,w."achievementXp" FROM "LearningPointProgress" l JOIN "TrailPoint" p ON p.id=l."pointId" JOIN "LearningTrail" t ON t.slug=p."trailSlug" JOIN "RpgWallet" w ON w."userId"=l."userId" WHERE l."userId"=${user}`;
		assert.equal(history.xp, 10);
		assert.ok(history.completedAt);
		assert.equal(history.archived, true);
		assert.equal(history.bits, 77);
		assert.equal(history.achievementXp, 5);
		const [counts] =
			await db.$queryRaw`SELECT (SELECT count(*)::int FROM "TrailPoint" WHERE "trailSlug"='elementar') AS active,(SELECT count(*)::int FROM "TrailPoint" WHERE "trailSlug"='elementar-v1-20261112') AS archived,(SELECT count(*)::int FROM "LearningPointProgress" l JOIN "TrailPoint" p ON p.id=l."pointId" WHERE p."trailSlug"='elementar' AND l."userId"=${user}) AS "newProgress"`;
		assert.deepEqual(counts, { active: 60, archived: 10, newProgress: 0 });
		await db.$executeRaw`DELETE FROM "User" WHERE id=${user}`;
		console.log(
			"Arquivo verificado: histórico, conclusão, XP e Bits preservados; nova trilha com 60 passos e progresso independente.",
		);
	} else throw new Error("Informe preparar ou conferir.");
} finally {
	await db.$disconnect();
}
