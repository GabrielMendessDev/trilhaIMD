import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { LevelBar } from "~/app/_components/level-progress";
import { RpgMedal } from "~/app/_components/rpg-icon";
import { auth } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
import { getStudyInsights } from "~/server/study-insights";
import {
	CourseEvolution,
	LearningHistory,
	ReviewRecommendations,
	StudyRhythm,
} from "./study-sections";
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
	const earned = progress.rpg.achievements.filter((a) => a.unlockedAt);
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
					<StudyRhythm history={insights.history} />
					<CourseEvolution insights={insights} />
				</div>
				<ReviewRecommendations insights={insights} />
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
				<LearningHistory insights={insights} />
			</div>
		</DashboardLayout>
	);
}
