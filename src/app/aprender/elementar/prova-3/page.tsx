import type { Metadata } from "next";
import ExamPage from "../_exam/page-content";
export const metadata: Metadata = { title: "Prova 3 de Matemática Elementar" };
export default function Page(props: {
	searchParams: Promise<{
		tentativa?: string;
		questao?: string;
		aviso?: string;
	}>;
}) {
	return <ExamPage {...props} unit={3} />;
}
