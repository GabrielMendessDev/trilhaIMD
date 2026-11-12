import type { PublishedPoint } from "~/server/learning";
import Link from "./action-link";
import { Icon } from "./icon";
export function CourseChapters({
	points,
	completed,
	current,
	trail,
}: {
	points: PublishedPoint[];
	completed: number[];
	current?: number;
	trail: string;
}) {
	const chapters =
		trail === "elementar"
			? [
					{
						name: "Matemática Elementar · Passos 1 a 60",
						start: 1,
						end: 60,
						objective:
							"Percorra a sequência completa de fundamentos, polinômios, funções, trigonometria e matrizes num único mapa.",
					},
				]
			: [
					{
						name: "Primeira unidade",
						start: 1,
						end: 10,
						objective:
							"Explore os conceitos e avance pelas lições publicadas desta disciplina.",
					},
				];
	if (!points.length)
		return (
			<section className="course-unpublished">
				<Icon className="size-7" name="book" />
				<h2>Esta jornada está sendo preparada</h2>
				<p>
					Os materiais de exploração disponíveis podem ser consultados no mapa.
					As lições com progresso e recompensas aparecerão conforme forem
					publicadas.
				</p>
			</section>
		);
	return (
		<section className="course-chapters">
			<header>
				<h2>
					{trail === "elementar"
						? "Conteúdo da trilha"
						: "Capítulos da unidade"}
				</h2>
				<p>Aprenda o conceito, pratique e revise no seu ritmo.</p>
			</header>
			<ol>
				{chapters.map((ch) => {
					const lessons = points.filter(
							(p) => p.number >= ch.start && p.number <= ch.end,
						),
						done = lessons.filter((p) => completed.includes(p.number)).length;
					if (!lessons.length) return null;
					const active =
						current !== undefined && current >= ch.start && current <= ch.end;
					return (
						<li key={ch.start}>
							<details open={active || undefined}>
								<summary>
									<span className="chapter-mark">
										<Icon
											className="size-5"
											name={done === lessons.length ? "check" : "book"}
										/>
									</span>
									<span>
										<strong>{ch.name}</strong>
										<small>
											Lições {lessons[0]?.number}–{lessons.at(-1)?.number}
										</small>
									</span>
									<b>
										{done}/{lessons.length}
									</b>
									<Icon className="size-4" name="chevron" />
								</summary>
								<div>
									<p>{ch.objective}</p>
									<ul>
										{lessons.map((p) => (
											<li key={p.id}>
												{current !== undefined &&
												p.number > current &&
												!completed.includes(p.number) ? (
													<span className="chapter-locked">
														<Icon className="size-4" name="lock" />
														{p.title ?? `Lição ${p.number}`}
													</span>
												) : (
													<Link href={`/aprender/${p.trail}/${p.number}`}>
														<Icon
															className="size-4"
															name={
																completed.includes(p.number)
																	? "check"
																	: p.number %
																				(trail === "elementar" ? 20 : 5) ===
																			0
																		? "star"
																		: "book"
															}
														/>
														{p.title ?? `Lição ${p.number}`}
														<Icon className="size-4" name="arrow" />
													</Link>
												)}
											</li>
										))}
									</ul>
								</div>
							</details>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
