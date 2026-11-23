import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
	ProgressBar,
} from "~/app/_components/dashboard";
import { LevelBar } from "~/app/_components/level-progress";
import { RpgMedal } from "~/app/_components/rpg-icon";
import { dayAt, dayIndex, studyDay } from "~/domain/rpg";
import { auth } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
import { getStudyInsights } from "~/server/study-insights";
export const metadata = { title: "Progresso" };
export default async function ProgressoPage() {
	const user = (await auth())?.user;
	const [progress, insights] = await Promise.all([
		user ? getLearningProgress(user.id) : null,
		user ? getStudyInsights(user.id) : null,
	]);
	if (!progress || !insights)
		return (
			<DashboardLayout active="/progresso">
				<div className="ui-page">
					<PageHeading
						description="Cada conceito aprendido e cada questão revisada fazem parte da sua história."
						title="Sua evolução começa aqui"
					/>
					<section className="journey-empty">
						<Icon className="size-12" name="chart" />
						<h2>
							{user
								? "Seu progresso está indisponível"
								: "Guarde seus próximos passos"}
						</h2>
						<p>
							{user
								? "Tente novamente em instantes."
								: "Entre na sua conta para acompanhar XP, conquistas, revisões e seu ritmo de estudo."}
						</p>
						<Link className="ui-button" href={user ? "/aprender" : "/login"}>
							{user ? "Ver trilhas" : "Entrar com Google"}
						</Link>
					</section>
				</div>
			</DashboardLayout>
		);
	const level = progress.rpg.level;
	const days = Array.from({ length: 7 }, (_, i) => {
		const day = dayAt(dayIndex(studyDay(new Date())) - 6 + i);
		return {
			day,
			count: insights.history.filter(
				(h) => h.at && studyDay(new Date(h.at)) === day,
			).length,
		};
	});
	const highest = Math.max(1, ...days.map((d) => d.count));
	const earned = progress.rpg.achievements.filter((a) => a.unlockedAt);
	const reviews = insights.review
		.filter((r) => r.kind !== "recovered")
		.slice(0, 5);
	return (
		<DashboardLayout active="/progresso">
			<div className="ui-page evolution-page">
				<PageHeading
					description="Seu ritmo, suas descobertas e os conceitos que merecem mais uma visita."
					title="Veja o quanto você avançou"
				/>
				<section className="level-journey">
					<span className="level-crest">
						<Icon className="size-9" name="shield" />
						<b>{level.level}</b>
					</span>
					<div>
						<h2>Nível {level.level}</h2>
						<p>{progress.xp.toLocaleString("pt-BR")} XP acumulados</p>
						<LevelBar level={level} />
						<small>
							{level.next === null
								? "Nível máximo atingido."
								: `Faltam ${level.remaining.toLocaleString("pt-BR")} XP para o nível ${level.level + 1}.`}
						</small>
						<Link
							className="ui-link mt-2 block"
							href={`/niveis?nivel=${level.level}`}
						>
							Ver níveis e recompensas
						</Link>
					</div>
					<Link className="ui-button" href="/aprender">
						Continuar jornada <Icon className="size-4" name="arrow" />
					</Link>
				</section>
				<dl className="evolution-facts">
					<div>
						<dt>
							<Icon className="size-5" name="fire" />
							Ofensiva
						</dt>
						<dd>
							{progress.streak}
							<small>dias de estudo</small>
						</dd>
					</div>
					<div>
						<dt>
							<Icon className="size-5" name="check" />
							Lições concluídas
						</dt>
						<dd>
							{progress.done.length}
							<small>{insights.activeCourses} trilhas em andamento</small>
						</dd>
					</div>
					<div>
						<dt>
							<Icon className="size-5" name="bolt" />
							Precisão de primeira
						</dt>
						<dd>
							{insights.accuracy === null ? "—" : `${insights.accuracy}%`}
							<small>{insights.attempted} questões respondidas</small>
						</dd>
					</div>
					<div>
						<dt>
							<Icon className="size-5" name="practice" />
							Recuperadas
						</dt>
						<dd>
							{insights.recovered}
							<small>acertos na revisão</small>
						</dd>
					</div>
				</dl>
				<div className="evolution-columns">
					<section className="study-rhythm">
						<h2>Seu ritmo nesta semana</h2>
						<p>
							Lições concluídas por dia. Cada barra representa seu estudo
							registrado.
						</p>
						<div
							aria-label={days
								.map((d) => `${d.day}: ${d.count} lições`)
								.join("; ")}
							className="study-week"
							role="img"
						>
							{days.map((d) => (
								<div key={d.day}>
									<span>{d.count}</span>
									<i
										style={{
											height: `${Math.max(3, (d.count / highest) * 100)}%`,
										}}
									/>
									<small>
										{new Date(`${d.day}T12:00Z`)
											.toLocaleDateString("pt-BR", {
												weekday: "short",
												timeZone: "America/Sao_Paulo",
											})
											.replace(".", "")}
									</small>
								</div>
							))}
						</div>
					</section>
					<section className="course-evolution">
						<h2>Progresso nas disciplinas</h2>
						{insights.courses
							.filter((c) => c.total > 0)
							.map((c) => (
								<Link href={`/disciplinas/${c.id}`} key={c.id}>
									<div>
										<strong>{c.name}</strong>
										<span>
											{c.done}/{c.total}
										</span>
									</div>
									<ProgressBar label={c.name} value={c.percent} />
								</Link>
							))}
						<p>
							{insights.bestCourse
								? `Sua maior evolução está em ${insights.bestCourse.name}.`
								: "Conclua a primeira lição para começar seu histórico."}
						</p>
					</section>
				</div>
				<section className="review-recommendations">
					<header>
						<h2>Dar mais um passo no conceito</h2>
						<span>
							{reviews.length ? "Revisões recomendadas" : "Tudo em dia"}
						</span>
					</header>
					{reviews.length ? (
						<ul>
							{reviews.map((r) => (
								<li key={`${r.pointId}-${r.key}`}>
									<Icon className="size-5" name="book" />
									<div>
										<strong>{r.topic}</strong>
										<small>
											{r.title} ·{" "}
											{r.kind === "pending"
												? "Revisão pendente"
												: r.kind === "skipped"
													? "Questão pulada"
													: "Precisa revisar"}
										</small>
									</div>
									<Link className="ui-link" href={r.href}>
										Rever <Icon className="size-4" name="arrow" />
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>
							Quando uma questão pedir mais estudo, o caminho para rever o
							conceito aparecerá aqui.
						</p>
					)}
				</section>
				<section className="evolution-awards">
					<header>
						<h2>Marcos da sua jornada</h2>
						<Link className="ui-link" href="/conquistas">
							Ver coleção <Icon className="size-4" name="arrow" />
						</Link>
					</header>
					{earned.length ? (
						<ul>
							{earned.slice(0, 6).map((a) => (
								<li data-rarity={a.rarity} key={a.id}>
									<RpgMedal
										category={a.category}
										goal={a.goal}
										symbol={a.symbol}
									/>
									<strong>{a.name}</strong>
								</li>
							))}
						</ul>
					) : (
						<p>
							Sua primeira conquista começa com um dia de estudo. O Bito guarda
							um lugar para ela aqui.
						</p>
					)}
				</section>
				<section className="learning-history">
					<h2>Histórico de evolução</h2>
					{insights.history.length ? (
						<ol>
							{insights.history
								.slice(-8)
								.reverse()
								.map((h) => (
									<li key={h.pointId}>
										<Icon className="size-4" name="check" />
										<span>{h.title}</span>
										<small>
											{h.at
												? new Date(h.at).toLocaleDateString("pt-BR", {
														timeZone: "America/Sao_Paulo",
													})
												: ""}
										</small>
										<b>+{h.xp} XP</b>
									</li>
								))}
						</ol>
					) : (
						<p>Suas lições concluídas formarão este histórico.</p>
					)}
				</section>
			</div>
		</DashboardLayout>
	);
}
