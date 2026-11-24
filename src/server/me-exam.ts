import { fmcCurriculum } from "~/domain/fmc-curriculum";
import type { ExamTrail, ExamUnit } from "~/domain/me-exams";
import "server-only";
import { elementarCurriculum } from "~/domain/elementar-curriculum";
import { db } from "./db";
import { answersSchema, examSchema } from "./me-exam-bank.mjs";

function curriculumUnit(number: ExamUnit, trail: ExamTrail) {
	const unit = (
		trail === "fmc" ? fmcCurriculum : elementarCurriculum
	).unidades.find((unit) => unit.unidade === number);
	if (!unit)
		throw new Error(`Unidade ${number} ausente do manifesto de ${trail}`);
	return unit;
}

export type ExamRow = {
	id: string;
	unit: ExamUnit;
	trail: ExamTrail;
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
export async function getExam(
	id: string,
	userId: string,
	unit: ExamUnit = 1,
	trail: ExamTrail = "elementar",
) {
	const rows = await db.$queryRaw<
		ExamRow[]
	>`SELECT * FROM "MeExamAttempt" WHERE id=${id} AND "userId"=${userId} AND unit=${unit} AND trail=${trail}`;
	return rows[0] ? readExam(rows[0]) : null;
}

export async function canTakeExam(
	userId: string,
	number: ExamUnit,
	trail: ExamTrail = "elementar",
) {
	const unitOne = curriculumUnit(number, trail);
	const rows = await db.$queryRaw<{ unlocked: boolean }[]>`
 SELECT count(*) = ${unitOne.fim - unitOne.inicio + 1} AND count(g."completedAt") = ${unitOne.fim - unitOne.inicio + 1} AS unlocked
 FROM "TrailPoint" p LEFT JOIN "LearningPointProgress" g
 ON g."pointId"=p.id AND g."userId"=${userId}
 WHERE p."trailSlug"=${trail} AND p.number BETWEEN ${unitOne.inicio} AND ${unitOne.fim}
 `;
	return rows[0]?.unlocked === true;
}

export const canTakeUnitOneExam = (userId: string) => canTakeExam(userId, 1);
