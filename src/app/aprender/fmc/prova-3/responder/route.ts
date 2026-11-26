import { submitExam } from "~/server/me-exam-response";
export function POST(request: Request) {
	return submitExam(request, 3, "fmc");
}
