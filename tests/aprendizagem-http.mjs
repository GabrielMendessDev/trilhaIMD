import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PrismaClient } from "../generated/prisma/index.js";

process.loadEnvFile();
const origin = new URL(process.env.TRILBIT_TEST_URL ?? "http://127.0.0.1:3317")
	.origin;
const database = new URL(
	process.env.TRILBIT_TEST_DATABASE_URL ?? process.env.DATABASE_URL,
);
const local = new Set(["localhost", "127.0.0.1", "[::1]"]);
assert.ok(
	local.has(new URL(origin).hostname) && local.has(database.hostname),
	"Use apenas app e banco locais neste teste.",
);
const db = new PrismaClient({ datasourceUrl: database.href });
const path = "/aprender/elementar/1";

async function learner() {
	const id = `teste-aprendizagem-${randomUUID()}`;
	const token = randomUUID();
	await db.$transaction([
		db.$executeRaw`INSERT INTO "User" (id, name) VALUES (${id}, 'Estudante de teste')`,
		db.$executeRaw`INSERT INTO "Session" (id, "sessionToken", "userId", expires) VALUES (${randomUUID()}, ${token}, ${id}, timezone('UTC', now() + interval '1 hour'))`,
	]);
	const cookie = `authjs.session-token=${token}; __Secure-authjs.session-token=${token}`;
	return { id, cookie };
}

async function page(learner, target = path) {
	const response = await fetch(`${origin}${target}`, {
		headers: { cookie: learner.cookie },
	});
	assert.equal(response.status, 200);
	return response.text();
}

async function send(learner, entry, round, answer = entry.answer) {
	const form = new FormData();
	form.set("item", entry.key);
	form.set("rodada", String(round));
	if (entry.type === "WALKTHROUGH") form.set("resposta", "concluido");
	else if (typeof answer === "string") form.set("resposta", answer);
	else
		for (const { origem, destino } of answer ?? [])
			form.set(`resposta:${origem}`, destino);
	const response = await fetch(`${origin}${path}/responder`, {
		method: "POST",
		body: form,
		headers: { cookie: learner.cookie, origin },
	});
	return { status: response.status, ...(await response.json()) };
}

test("fluxo publicado preserva revisão, feedback e XP no PostgreSQL", async () => {
	const [point] =
		await db.$queryRaw`SELECT id, "xpReward" AS reward FROM "TrailPoint" WHERE "trailSlug" = 'elementar' AND number = 1`;
	const entries = await db.$queryRaw`
		SELECT a.id::text || '-' || e.number::text AS key, e.type, e.answer, e.payload, e.content
		FROM "LearningActivity" a JOIN "LearningEntry" e ON a.id = e."activityId"
		WHERE a."pointId" = ${point.id} ORDER BY a.id, COALESCE(e.position, e.number), e.number
	`;
	const graded = entries.filter(({ answer }) => answer !== null);
	const [missed, recover] = graded.filter(
		({ type }) => type === "MULTIPLE_CHOICE",
	);
	assert.ok(missed && recover && graded.length > 10);
	const material = entries.find(
		({ content }) => content?.categoria === "material",
	);
	assert.ok(material);
	const wrong = (entry) =>
		entry.payload.alternativas.find(({ id }) => id !== entry.answer).id;
	const students = [];
	const progress = async (student) => {
		const [row] =
			await db.$queryRaw`SELECT attempts, xp, "correctAnswers", "completedAt" FROM "LearningPointProgress" WHERE "userId" = ${student.id} AND "pointId" = ${point.id}`;
		return row;
	};
	try {
		const student = await learner();
		students.push(student);
		assert.match(await page(student), /Da lista ao conjunto/);
		assert.match(
			await page(student, `${path}?material=${material.key}`),
			/Ficha de leitura dos símbolos/,
		);
		assert.equal((await send(student, missed, 1)).status, 422);
		let sawDiagram = false;
		let sawFormula = false;
		for (const entry of entries) {
			if (
				entry.content?.blocos?.some(
					({ tipo }) => tipo === "diagrama" || tipo === "formula",
				)
			) {
				const html = await page(student);
				assert.match(
					html,
					new RegExp(
						entry.content.titulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
					),
				);
				sawDiagram ||=
					html.includes("<svg") &&
					html.includes("Reta numérica da esquerda para a direita");
				sawFormula ||=
					html.includes("<mfrac>") &&
					html.includes("<msqrt>") &&
					html.includes("<mo>=</mo>");
			}
			const incorrect = entry === missed || entry === recover;
			const result = await send(
				student,
				entry,
				1,
				incorrect ? wrong(entry) : entry.answer,
			);
			assert.equal(result.status, 200, result.error);
			if (incorrect) {
				const next = entries[entries.indexOf(entry) + 1];
				assert.equal(result.continueTo, `${path}?item=${next.key}`);
				const html = await page(student, result.destination);
				assert.match(html, /Resposta incorreta/);
				assert.doesNotMatch(html, /<h3>Resposta correta<\/h3>/);
				assert.match(
					await page(student, result.destination),
					/Resposta incorreta/,
				);
				assert.doesNotMatch(await page(student), /Hora de revisar!/);
				assert.equal((await send(student, entry, 2)).status, 422);
				assert.equal((await send(student, entry, 1)).status, 422);
			}
		}
		assert.ok(sawDiagram && sawFormula);
		assert.equal((await progress(student)).xp, 0);
		assert.match(await page(student), /Hora de revisar!/);
		assert.equal((await send(student, recover, 2)).status, 422);
		const outcome = await send(student, missed, 2, wrong(missed));
		const definitive = await page(student, outcome.destination);
		assert.match(definitive, /<h3>Resposta correta<\/h3>/);
		assert.match(definitive, /Ver exemplo resolvido da atividade/);
		assert.match(
			definitive,
			/<div class="study-progress"><progress aria-label="Passos do roteiro"/,
		);
		assert.equal((await send(student, missed, 2)).status, 422);
		const [retry, replay] = await Promise.all([
			send(student, recover, 2),
			send(student, recover, 2),
		]);
		assert.equal(retry.status, 200, retry.error);
		assert.equal(replay.destination, retry.destination);
		assert.equal(replay.continueTo, retry.continueTo);
		assert.match(await page(student, retry.destination), /Questão recuperada/);
		assert.match(await page(student), /Etapa concluída!/);
		assert.equal((await send(student, recover, 3)).status, 400);
		const final = await progress(student);
		assert.ok(final.completedAt);
		assert.equal(final.xp, point.reward);
		assert.equal(final.correctAnswers, graded.length - 1);
		assert.equal(final.attempts[recover.key].length, 2);
		assert.equal(final.attempts[missed.key].length, 2);
		assert.deepEqual(await progress(student), final);

		const perfect = await learner();
		students.push(perfect);
		for (const entry of entries) {
			const result = await send(perfect, entry, 1);
			assert.equal(result.status, 200, result.error);
		}
		assert.match(await page(perfect), /Etapa concluída!/);
		const finished = await progress(perfect);
		assert.equal(finished.correctAnswers, graded.length);
		assert.equal(finished.xp, point.reward);
		assert.ok(
			Object.values(finished.attempts).every(
				(attempts) => attempts.length === 1 && attempts[0].correct,
			),
		);
	} finally {
		try {
			for (const { id } of students)
				await db.$executeRaw`DELETE FROM "User" WHERE id = ${id}`;
		} finally {
			await db.$disconnect();
		}
	}
});
