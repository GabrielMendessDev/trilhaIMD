import type { Metadata } from "next";
import ExamPage from "../../elementar/_exam/page-content";
export const metadata: Metadata = { title: "Prova 1 de FMC 1" };
export default function Page(props: {
	searchParams: Promise<{
		tentativa?: string;
		questao?: string;
		aviso?: string;
	}>;
}) {
	return <ExamPage {...props} trail="fmc" unit={1} />;
}
