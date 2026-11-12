import Image from "next/image";
import Link from "~/app/_components/action-link";
import { DailyMissions } from "~/app/_components/daily-missions";
import { DashboardLayout, Icon } from "~/app/_components/dashboard";
import { JourneyBanner } from "~/app/_components/journey-banner";
import { RpgIcon, RpgMedal } from "~/app/_components/rpg-icon";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { getStudyInsights } from "~/server/study-insights";
import { stagesByTrail } from "./aprender/_etapa/stages";
import { TrailMap } from "./aprender/trail-map";
import { trailMapHref, trails } from "./aprender/trails";
export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ trilha?: string }>;
}) {
	const user = (await auth())?.user;
	const [query, catalog, progress, insights] = await Promise.all([
		searchParams,
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
		user ? getStudyInsights(user.id) : null,
	]);
	const active =
		trails.find((t) => t.id === query.trilha) ??
		trails.find((t) =>
			catalog?.some(
				(p) =>
					p.trail === t.id && progress?.rows.some((r) => r.pointId === p.id),
			),
		) ??
		trails[0];
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		active.id,
	);
	const award = progress?.rpg.achievements
		.filter((a) => !a.unlockedAt)
		.sort((a, b) => b.current / b.goal - a.current / a.goal)[0];
	const review =
		insights?.review.filter((r) => r.kind !== "recovered").slice(0, 2) ?? [];
	const stock =
		progress?.rpg.inventory.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
	return (
		<DashboardLayout active="/">
			<div className="ui-page home-journey">
				<header className="welcome-heading">
					<div>
						<h1>Olá, {user?.name?.trim().split(/\s+/)[0] ?? "estudante"}!</h1>
						<p>Um novo passo faz parte da sua evolução.</p>
					</div>
					<Link className="daily-goal-link" href="/missoes">
						<Icon className="size-5" name="flag" />
						<span>
							Meta de hoje
							<strong>
								{insights?.daily.lessons
									? "Lição concluída!"
									: "Concluir uma lição"}
							</strong>
						</span>
						<b>{Math.min(insights?.daily.lessons ?? 0, 1)}/1</b>
					</Link>
				</header>
				<div className="home-journey-columns">
					<section
						aria-label="Sua jornada de aprendizagem"
						className="journey-main"
					>
						<nav aria-label="Escolher trilha" className="trail-switcher">
							{trails.map((t) => (
								<Link
									aria-current={active.id === t.id ? "page" : undefined}
									data-trail={t.id}
									href={`/?trilha=${t.id}`}
									key={t.id}
									scroll={false}
								>
									{t.label}
								</Link>
							))}
						</nav>
						<div className="journey-world" data-trail={active.id}>
							<JourneyBanner
								completed={completed.length}
								href={
									next ? `/aprender/${active.id}/${next.number}` : undefined
								}
								next={next}
								total={published.length}
								trail={active}
							/>
							<div className="journey-map-surface">
								<div className="journey-map-label">
									<h3>Seu caminho, um passo por vez</h3>
									<Link className="ui-link" href={trailMapHref(active.id)}>
										Ver trilha <Icon className="size-4" name="arrow" />
									</Link>
								</div>
								<TrailMap
									completedStages={completed.map((p) => p.number)}
									currentStage={next?.number}
									initialStage={next?.number ?? 1}
									previewStages={Object.keys(
										stagesByTrail[active.id] ?? {},
									).map(Number)}
									publishedStages={published}
									reviewStages={[
										...new Set(
											review
												.filter((r) => r.trail === active.id)
												.map((r) => r.number),
										),
									]}
									sequential={Boolean(progress)}
									trail={active}
								/>
							</div>
						</div>
					</section>
					<aside
						aria-label="Recursos da sua jornada"
						className="journey-support"
					>
						<DailyMissions compact daily={insights?.daily ?? null} />
						{award && (
							<section className="next-achievement">
								<header>
									<h2>Próxima conquista</h2>
									<Link className="ui-link" href="/conquistas">
										Coleção
									</Link>
								</header>
								<div>
									<RpgMedal
										category={award.category}
										goal={award.goal}
										symbol={award.symbol}
									/>
									<p>
										<strong>{award.name}</strong>
										<span>
											{award.current}/{award.goal}
										</span>
										<small>
											+{award.xp} XP · +{award.bits} Bits
										</small>
									</p>
								</div>
							</section>
						)}
						<section className="streak-story">
							<Icon className="size-7" name="fire" />
							<div>
								<h2>
									{progress
										? `${progress.streak} ${progress.streak === 1 ? "dia" : "dias"} de ofensiva`
										: "Sua rotina começa aqui"}
								</h2>
								<p>
									{progress?.streak
										? "Continue hoje para manter seu ritmo."
										: "Cada dia de estudo conta na sua jornada."}
								</p>
							</div>
						</section>
						{review.length > 0 && (
							<section className="home-review">
								<h2>Um reforço pode ajudar</h2>
								{review.map((r) => (
									<Link href={r.href} key={`${r.pointId}-${r.key}`}>
										<Icon className="size-5" name="book" />
										<span>
											{r.topic}
											<small>{r.title}</small>
										</span>
										<Icon className="size-4" name="arrow" />
									</Link>
								))}
							</section>
						)}
						<section className="bito-outpost">
							<Image
								alt="Bito acompanha sua jornada"
								height={600}
								src="/brand/bito.webp"
								unoptimized
								width={900}
							/>
							<h2>Prepare a próxima aventura</h2>
							<p>
								{progress
									? `${progress.rpg.bits} Bits para escolher seus recursos.`
									: "Ganhe Bits com seu progresso e descubra novos recursos."}
							</p>
							<div>
								<Link href="/loja">
									<RpgIcon name="bits" />
									Loja do Bito
									<Icon className="size-4" name="arrow" />
								</Link>
								<Link href="/mochila">
									<RpgIcon name="bag" />
									Mochila <span>{stock} itens</span>
								</Link>
							</div>
						</section>
						{!user && (
							<Link className="ui-button" href="/login">
								Salvar minha jornada
							</Link>
						)}
					</aside>
				</div>
			</div>
		</DashboardLayout>
	);
}
