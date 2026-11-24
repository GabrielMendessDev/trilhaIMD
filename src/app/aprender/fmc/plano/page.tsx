import type { Metadata } from "next";
import Link from "~/app/_components/action-link";
import { DashboardLayout } from "~/app/_components/dashboard";
import { fmcCurriculum } from "~/domain/fmc-curriculum";
import { type ExamUnit, examPath, examUnits } from "~/domain/me-exams";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { canTakeExam } from "~/server/me-exam";

export const metadata: Metadata = { title: "Unidades de FMC 1" };
export default async function FmcPlanPage() {
	const user = (await auth())?.user;
	const [catalog, progress, unlocked] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
		Promise.all(
			examUnits.map((number) =>
				user ? canTakeExam(user.id, number, "fmc") : false,
			),
		),
	]);
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		"fmc",
	);
	const accessible = new Set([
		...completed.map((p) => p.number),
		...(next ? [next.number] : []),
	]);
	return (
		<DashboardLayout active="/aprender">
			<main className="ui-page space-y-6">
				<Link className="ui-link" href="/aprender?modulo=fmc">
					Voltar à trilha
				</Link>
				<h1 className="font-black text-3xl">Unidades de FMC 1</h1>
				<Link className="ui-link" href="/materiais/fmc/leitor.html">
					Consultar o material completo e os exercícios comentados
				</Link>
				<p>
					Três unidades de seis módulos. Estude, pratique e revise antes de
					realizar a avaliação.
				</p>
				{fmcCurriculum.unidades.map((unit) => (
					<section
						className="ui-panel space-y-4 p-5"
						id={`unidade-${unit.unidade}`}
						key={unit.unidade}
					>
						<h2 className="font-bold text-2xl">
							Unidade {unit.unidade} · Etapas {unit.inicio} a {unit.fim}
						</h2>
						<ol className="space-y-3">
							{fmcCurriculum.passos
								.filter((p) => p.ponto >= unit.inicio && p.ponto <= unit.fim)
								.map((p) => (
									<li key={p.ponto}>
										{published.some((s) => s.number === p.ponto) &&
										user &&
										progress &&
										accessible.has(p.ponto) ? (
											<Link
												className="ui-link"
												href={`/aprender/fmc/${p.ponto}`}
											>
												{p.ponto}. {p.titulo}
											</Link>
										) : (
											<span>
												{p.ponto}. {p.titulo} ·{" "}
												{user
													? "Conclua as etapas anteriores para liberar"
													: "Entre para registrar seu progresso"}
											</span>
										)}
									</li>
								))}
						</ol>
						<div>
							<h3 className="font-bold">Prova {unit.unidade} · 20 questões</h3>
							{unlocked[unit.unidade - 1] ? (
								<Link
									className="ui-button mt-3"
									href={examPath(unit.unidade as ExamUnit, "fmc")}
								>
									Abrir Prova {unit.unidade}
								</Link>
							) : (
								<p>
									Conclua as etapas {unit.inicio} a {unit.fim} da Unidade{" "}
									{unit.unidade} para liberar a prova.
								</p>
							)}
						</div>
					</section>
				))}
				<section className="ui-panel space-y-3 p-5">
					<h2 className="font-bold text-2xl">Desafio final opcional</h2>
					<p>
						As três provas estão disponíveis após os módulos de cada unidade.
						Uma avaliação opcional adicional poderá ser preparada depois.
					</p>
				</section>
			</main>
		</DashboardLayout>
	);
}
