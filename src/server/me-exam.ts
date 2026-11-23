import "server-only";
import { elementarCurriculum } from "~/domain/elementar-curriculum";
import { db } from "./db";
import { answersSchema, examSchema } from "./me-exam-bank.mjs";

function firstUnit() {
	const unit = elementarCurriculum.unidades.find((unit) => unit.unidade === 1);
	if (!unit) throw new Error("Unidade 1 ausente do manifesto de ME");
	return unit;
}
const unitOne = firstUnit();
export type ExamRow = {
	id: string;
	userId: string;
	version: number;
	questions: unknown;
	answers: unknown;
	revision: number;
	createdAt: Date;
	submittedAt: Date | null;
	score: number | null;
};
export function readExam(row: ExamRow) {
	return {
		...row,
		questions: examSchema.parse(row.questions),
		answers: answersSchema.parse(row.answers),
	};
}
export async function getExam(id: string, userId: string) {
	const rows = await db.$queryRaw<
		ExamRow[]
	>`SELECT * FROM "MeExamAttempt" WHERE id=${id} AND "userId"=${userId}`;
	return rows[0] ? readExam(rows[0]) : null;
}

export async function canTakeUnitOneExam(userId: string) {
	const rows = await db.$queryRaw<{ unlocked: boolean }[]>`
 SELECT count(*) = ${unitOne.fim - unitOne.inicio + 1} AND count(g."completedAt") = ${unitOne.fim - unitOne.inicio + 1} AS unlocked
 FROM "TrailPoint" p LEFT JOIN "LearningPointProgress" g
 ON g."pointId"=p.id AND g."userId"=${userId}
 WHERE p."trailSlug"='elementar' AND p.number BETWEEN ${unitOne.inicio} AND ${unitOne.fim}
 `;
	return rows[0]?.unlocked === true;
}
