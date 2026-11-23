import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { canTakeUnitOneExam, type ExamRow, readExam } from "~/server/me-exam";
import { examScore, examVersion, unitOneExam } from "~/server/me-exam-bank.mjs";

const base = "/aprender/elementar/prova-1";
export async function POST(request: Request) {
	const url = new URL(request.url);
	if (request.headers.get("origin") !== url.origin)
		return new NextResponse(null, { status: 403 });
	const user = (await auth())?.user;
	if (!user) return new NextResponse(null, { status: 401 });
	if (!(await canTakeUnitOneExam(user.id)))
		return new NextResponse(
			"Conclua as etapas 1 a 20 da Unidade 1 para acessar a prova.",
			{ status: 403 },
		);
	const form = await request.formData();
	const action = form.get("action");
	const go = (query: string) =>
		NextResponse.redirect(new URL(base + query, url), 303);
	if (action === "start") {
		const id = randomUUID();
		await db.$executeRaw`INSERT INTO "MeExamAttempt" (id,"userId",version,questions) VALUES (${id},${user.id},${examVersion},${JSON.stringify(unitOneExam)}::jsonb)`;
		return go(`?tentativa=${id}`);
	}
	const id = form.get("attempt"),
		questionId = form.get("question"),
		answer = form.get("answer");
	const revision = Number(form.get("revision"));
	if (
		typeof id !== "string" ||
		!Number.isSafeInteger(revision) ||
		!["save", "finish"].includes(String(action))
	)
		return new NextResponse(null, { status: 400 });
	const result = await db.$transaction(async (tx) => {
		const rows = await tx.$queryRaw<
			ExamRow[]
		>`SELECT * FROM "MeExamAttempt" WHERE id=${id} AND "userId"=${user.id} FOR UPDATE`;
		if (!rows[0]) return { status: 404 };
		const exam = readExam(rows[0]);
		if (exam.submittedAt) return { query: `?tentativa=${id}` };
		if (exam.revision !== revision)
			return { query: `?tentativa=${id}&aviso=atualizada` };
		const q = exam.questions.find((q) => q.id === questionId);
		if (
			!q ||
			typeof answer !== "string" ||
			!q.choices.some((c) => c.id === answer)
		)
			return { status: 400 };
		const answers = { ...exam.answers, [q.id]: answer };
		const missing = exam.questions.findIndex(
			(q) => answers[q.id] === undefined,
		);
		const finish = action === "finish" && missing === -1;
		const score = finish ? examScore(exam.questions, answers) : null;
		await tx.$executeRaw`UPDATE "MeExamAttempt" SET answers=${JSON.stringify(answers)}::jsonb, revision=revision+1, "submittedAt"=${finish ? new Date() : null},score=${score} WHERE id=${id} AND "userId"=${user.id}`;
		const index = exam.questions.findIndex((item) => item.id === q.id);
		const next =
			action === "finish" && missing >= 0 ? missing : Math.min(index + 1, 19);
		return {
			query:
				"?tentativa=" +
				id +
				(finish ? "" : `&questao=${next + 1}`) +
				(action === "finish" && !finish ? "&aviso=incompleta" : ""),
		};
	});
	if ("status" in result)
		return new NextResponse(null, { status: result.status });
	return go(result.query);
}
