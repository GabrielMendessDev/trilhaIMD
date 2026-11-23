import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "~/app/_components/action-link";
import { DashboardLayout, ProgressBar } from "~/app/_components/dashboard";
import { LessonTransition } from "~/app/aprender/_etapa/lesson-motion";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { canTakeUnitOneExam, type ExamRow, getExam } from "~/server/me-exam";

export const metadata: Metadata = { title: "Prova 1 de Matemática Elementar" };
const base = "/aprender/elementar/prova-1";
export default async function ExamPage({
	searchParams,
}: {
	searchParams: Promise<{
		tentativa?: string;
		questao?: string;
		aviso?: string;
	}>;
}) {
	const user = (await auth())?.user;
	if (!user) redirect("/login");
	if (!(await canTakeUnitOneExam(user.id)))
		redirect("/aprender/elementar/plano#unidade-1");
	const params = await searchParams;
	const history = await db.$queryRaw<
		Pick<ExamRow, "id" | "createdAt" | "submittedAt" | "score">[]
	>`SELECT id,"createdAt","submittedAt",score FROM "MeExamAttempt" WHERE "userId"=${user.id} ORDER BY "createdAt" DESC LIMIT 10`;
	const exam = params.tentativa
		? await getExam(params.tentativa, user.id)
		: null;
	if (params.tentativa && !exam) notFound();
	const index = Math.max(0, Math.min(19, (Number(params.questao) || 1) - 1));
	const q = exam?.questions[Math.floor(index)];
	const answered = exam ? Object.keys(exam.answers).length : 0;
	return (
		<DashboardLayout active="/aprender">
			<main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
				<Link className="ui-link" href="/aprender/elementar/plano">
					Voltar às unidades de ME
				</Link>
				<h1 className="font-black text-3xl">
					Prova 1 — Fundamentos e equações
				</h1>
				<LessonTransition
					screenKey={`${exam?.id ?? "intro"}:${exam?.submittedAt ? "resultado" : Math.floor(index)}`}
				>
					{!exam ? (
						<section className="ui-panel space-y-4 p-6">
							<p>
								20 questões sobre conjuntos, números reais, potências,
								polinômios, logaritmos, equações, sistemas e inequações.
							</p>
							<p className="ui-muted">
								Sem tempo limite. As respostas são salvas ao avançar. Você pode
								voltar e alterá-las antes de entregar. O resultado e as soluções
								aparecem após a entrega. Cada acerto vale um ponto.
							</p>
							<p className="ui-muted">
								Você pode fazer novas tentativas, com histórico de resultados.
								Esta versão registra desempenho sem nota mínima e sem conceder
								XP extra.
							</p>
							<form action={`${base}/responder`} method="post">
								<button
									className="ui-button"
									name="action"
									type="submit"
									value="start"
								>
									Iniciar nova tentativa
								</button>
							</form>
						</section>
					) : exam.submittedAt ? (
						<section className="ui-panel space-y-4 p-6">
							<h2 className="font-bold text-2xl">
								Resultado — {exam.score} de 20 acertos
							</h2>
							<ProgressBar
								label="Desempenho na prova"
								value={(exam.score ?? 0) * 5}
							/>
							<p>
								Nota de desempenho{" "}
								{((exam.score ?? 0) / 2).toLocaleString("pt-BR")} de 10.
							</p>
							{exam.questions.map((item, i) => (
								<details
									className="rounded-xl border border-[var(--line)] p-4"
									key={item.id}
								>
									<summary>
										{i + 1}. {item.topic} —{" "}
										{exam.answers[item.id] === item.answer
											? "Acertou"
											: "Revisar"}
									</summary>
									<p className="mt-3">{item.prompt}</p>
									<p className="mt-2">
										Sua resposta —{" "}
										{
											item.choices.find((c) => c.id === exam.answers[item.id])
												?.text
										}
									</p>
									<p className="mt-2 font-semibold">
										Resposta correta —{" "}
										{item.choices.find((c) => c.id === item.answer)?.text}
									</p>
									<p className="ui-muted mt-2">{item.explanation}</p>
								</details>
							))}
							<Link className="ui-link" href={base}>
								Voltar às tentativas
							</Link>
						</section>
					) : (
						q && (
							<section className="ui-panel space-y-4 p-6">
								<p className="ui-muted">
									Questão {Math.floor(index) + 1} de 20 · {answered}{" "}
									{answered === 1 ? "resposta salva" : "respostas salvas"}
								</p>
								<ProgressBar label="Respostas salvas" value={answered * 5} />
								{params.aviso && (
									<p role="status">
										{params.aviso === "incompleta"
											? "Responda todas as questões antes de entregar."
											: "A tentativa foi atualizada em outra aba. Confira as respostas salvas."}
									</p>
								)}
								<form
									action={`${base}/responder`}
									className="space-y-4"
									method="post"
								>
									<input name="attempt" type="hidden" value={exam.id} />
									<input name="revision" type="hidden" value={exam.revision} />
									<input name="question" type="hidden" value={q.id} />
									<fieldset className="space-y-3">
										<legend className="mb-4 font-semibold text-lg">
											{q.prompt}
										</legend>
										{q.choices.map((c) => (
											<label
												className="answer-choice flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] p-4"
												key={c.id}
											>
												<input
													defaultChecked={exam.answers[q.id] === c.id}
													name="answer"
													required
													type="radio"
													value={c.id}
												/>
												<span>{c.text}</span>
											</label>
										))}
									</fieldset>
									<div className="flex flex-wrap gap-3">
										<button
											className="ui-button"
											name="action"
											type="submit"
											value="save"
										>
											Salvar e continuar
										</button>
										{(answered >= 19 || index === 19) && (
											<button
												className="ui-button"
												name="action"
												type="submit"
												value="finish"
											>
												Entregar prova
											</button>
										)}
									</div>
								</form>
								<p className="ui-muted text-sm">
									Salve a resposta antes de navegar para outra questão ou sair.
								</p>
								<nav
									aria-label="Questões da prova"
									className="flex flex-wrap gap-2"
								>
									{exam.questions.map((item, i) => (
										<Link
											aria-current={i === index ? "step" : undefined}
											className="ui-link rounded border border-[var(--line)] px-3 py-2"
											href={`${base}?tentativa=${exam.id}&questao=${i + 1}`}
											key={item.id}
										>
											{i + 1}
											{exam.answers[item.id] !== undefined ? " ✓" : ""}
										</Link>
									))}
								</nav>
							</section>
						)
					)}
				</LessonTransition>
				{history.length > 0 && (
					<section className="ui-panel p-6">
						<h2 className="font-bold text-xl">Suas tentativas</h2>
						<ul className="mt-3 space-y-3">
							{history.map((row) => (
								<li key={row.id}>
									<Link
										className="ui-link"
										href={`${base}?tentativa=${row.id}`}
									>
										{row.createdAt.toLocaleString("pt-BR", {
											timeZone: "America/Sao_Paulo",
										})}{" "}
										—{" "}
										{row.submittedAt
											? `${row.score}/20`
											: "Continuar tentativa"}
									</Link>
								</li>
							))}
						</ul>
					</section>
				)}
			</main>
		</DashboardLayout>
	);
}
