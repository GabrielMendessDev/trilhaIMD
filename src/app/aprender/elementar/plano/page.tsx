import type { Metadata } from "next";
import Link from "~/app/_components/action-link";
import { DashboardLayout } from "~/app/_components/dashboard";
import { elementarCurriculum } from "~/domain/elementar-curriculum";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { canTakeUnitOneExam } from "~/server/me-exam";

export const metadata: Metadata = { title: "Unidades de Matemática Elementar" };
export default async function MePlanPage() {
	const user = (await auth())?.user;
	const [catalog, progress, unlocked] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
		user ? canTakeUnitOneExam(user.id) : false,
	]);
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		"elementar",
	);
	const accessible = new Set([
		...completed.map((p) => p.number),
		...(next ? [next.number] : []),
	]);
	return (
		<DashboardLayout active="/aprender">
			<main className="ui-page space-y-6">
				<Link className="ui-link" href="/aprender?modulo=elementar">
					Voltar à trilha
				</Link>
				<h1 className="font-black text-3xl">
					Unidades de Matemática Elementar
				</h1>
				<p>
					Três unidades de 20 etapas. Estude, pratique e revise antes de
					realizar a avaliação.
				</p>
				{elementarCurriculum.unidades.map((unit) => (
					<section
						className="ui-panel space-y-4 p-5"
						id={`unidade-${unit.unidade}`}
						key={unit.unidade}
					>
						<h2 className="font-bold text-2xl">
							Unidade {unit.unidade} · Etapas {unit.inicio} a {unit.fim}
						</h2>
						<ol className="space-y-3">
							{elementarCurriculum.passos
								.filter((p) => p.ponto >= unit.inicio && p.ponto <= unit.fim)
								.map((p) => (
									<li key={p.ponto}>
										{published.some((s) => s.number === p.ponto) &&
										user &&
										progress &&
										accessible.has(p.ponto) ? (
											<Link
												className="ui-link"
												href={`/aprender/elementar/${p.ponto}`}
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
						{unit.unidade === 1 ? (
							<div>
								<h3 className="font-bold">Prova 1 · 20 questões</h3>
								{unlocked ? (
									<Link
										className="ui-button mt-3"
										href="/aprender/elementar/prova-1"
									>
										Abrir Prova 1
									</Link>
								) : (
									<p>
										Conclua as etapas 1 a 20 da Unidade 1 para liberar a prova.
									</p>
								)}
							</div>
						) : (
							<p>Avaliação da Unidade {unit.unidade}: em preparação.</p>
						)}
					</section>
				))}
				<section className="ui-panel space-y-3 p-5">
					<h2 className="font-bold text-2xl">Desafio final opcional</h2>
					<p>Avaliação integradora das três unidades, em preparação.</p>
				</section>
			</main>
		</DashboardLayout>
	);
}
