import Link from "~/app/_components/action-link";
import { Icon } from "~/app/_components/icon";
import { ProgressBar } from "~/app/_components/progress-bar";
import { dayAt, dayIndex, studyDay } from "~/domain/rpg";
import type { getStudyInsights } from "~/server/study-insights";

type Insights = NonNullable<Awaited<ReturnType<typeof getStudyInsights>>>;
export function StudyRhythm({ history }: Pick<Insights, "history">) {
	const end = dayIndex(studyDay(new Date()));
	const counts = new Map<string, number>();
	for (const { at } of history) {
		if (at) {
			const day = studyDay(new Date(at));
			counts.set(day, (counts.get(day) ?? 0) + 1);
		}
	}
	const days = Array.from({ length: 7 }, (_, i) => {
		const day = dayAt(end - 6 + i);
		return { day, count: counts.get(day) ?? 0 };
	});
	const highest = Math.max(1, ...days.map((d) => d.count));

	return (
		<section className="study-rhythm">
			<h2>Seu ritmo nesta semana</h2>
			<p>
				Lições concluídas por dia. Cada barra representa seu estudo registrado.
			</p>
			<div
				aria-label={days.map((d) => `${d.day}: ${d.count} lições`).join("; ")}
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
	);
}
export function CourseEvolution({ insights }: { insights: Insights }) {
	return (
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
	);
}
export function ReviewRecommendations({ insights }: { insights: Insights }) {
	const reviews = insights.review
		.filter((r) => r.kind !== "recovered")
		.slice(0, 5);
	return (
		<section className="review-recommendations">
			<header>
				<h2>Dar mais um passo no conceito</h2>
				<span>{reviews.length ? "Revisões recomendadas" : "Tudo em dia"}</span>
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
					Quando uma questão pedir mais estudo, o caminho para rever o conceito
					aparecerá aqui.
				</p>
			)}
		</section>
	);
}
export function LearningHistory({ insights }: { insights: Insights }) {
	return (
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
	);
}
