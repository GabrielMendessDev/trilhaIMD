import Link from "~/app/_components/action-link";
import { CourseChapters } from "~/app/_components/course-chapters";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { JourneyBanner } from "~/app/_components/journey-banner";
import { UnlockEffect } from "~/app/_components/reward-effects";
import { TrailSymbol } from "~/app/_components/trail-symbol";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { stagesByTrail } from "./_etapa/stages";
import { TrailDiagram } from "./trail-diagram";
import { TrailMap } from "./trail-map";
import { trailMapHref, trails } from "./trails";
export default async function AprenderPage({
	searchParams,
}: {
	searchParams: Promise<{
		modulo?: string;
		etapa?: string;
		concluida?: string;
	}>;
}) {
	const [query, catalog, student] = await Promise.all([
		searchParams,
		getPublishedPoints(),
		auth().then(async (session) => {
			const user = session?.user;
			return {
				user,
				progress: user ? await getLearningProgress(user.id) : null,
			};
		}),
	]);
	const trail = trails.find((t) => t.id === query.modulo) ?? trails[0];
	const { user, progress } = student;
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		trail.id,
	);
	const selected =
		trail.positions.findIndex((_, i) => String(i + 1) === query.etapa) + 1 ||
		next?.number ||
		1;
	const latest = progress?.done
		.filter((r) => completed.some((p) => p.id === r.pointId))
		.sort(
			(a, b) =>
				(b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0),
		)[0];
	return (
		<DashboardLayout active="/aprender">
			{user && next && latest?.completedAt && (
				<UnlockEffect
					eventId={`completion:${user.id}:${latest.pointId}:${latest.completedAt.toISOString()}`}
					stage={next.number}
				/>
			)}
			<div className="ui-page trails-page">
				<PageHeading
					description="Escolha sua jornada. Cada lição abre um novo caminho."
					title="Suas trilhas"
				/>
				<nav aria-label="Jornadas disponíveis" className="journey-catalog">
					{trails.map((t) => {
						const status = getTrailStatus(catalog ?? [], progress, t.id);
						return (
							<Link
								aria-current={trail.id === t.id ? "page" : undefined}
								className="course-mini"
								data-trail={t.id}
								href={trailMapHref(t.id)}
								key={t.id}
								scroll={false}
							>
								<TrailSymbol id={t.id} />
								<strong>{t.label}</strong>
								<span>
									{status.published.length
										? `${status.completed.length}/${status.published.length} lições`
										: "Em preparação"}
								</span>
							</Link>
						);
					})}
				</nav>
				<div className="trail-detail-columns">
					<section
						aria-label={`Percurso de ${trail.name}`}
						className="journey-world"
						data-trail={trail.id}
					>
						<JourneyBanner
							completed={completed.length}
							href={next ? `/aprender/${trail.id}/${next.number}` : undefined}
							next={next}
							total={published.length}
							trail={trail}
						/>
						<div className="journey-map-surface">
							<div className="journey-map-label">
								<h3>
									{trail.id === "elementar"
										? "Trilha completa · Passos 1 a 60"
										: "Explore o percurso"}
								</h3>
								<span className="journey-checkpoint-note">
									<Icon className="size-4" name="star" />{" "}
									{trail.id === "elementar"
										? "60 passos conectados"
										: "Checkpoints 5 e 10"}
								</span>
							</div>
							<TrailMap
								completedStages={completed.map((p) => p.number)}
								currentStage={next?.number}
								initialStage={selected}
								key={`${trail.id}-${selected}`}
								previewStages={Object.keys(stagesByTrail[trail.id] ?? {}).map(
									Number,
								)}
								publishedStages={published}
								sequential={Boolean(progress)}
								trail={trail}
							/>
						</div>
					</section>
					<aside
						aria-label="Conteúdo da unidade"
						className="trail-detail-support"
					>
						<CourseChapters
							completed={completed.map((p) => p.number)}
							current={progress ? next?.number : undefined}
							points={published}
							trail={trail.id}
						/>
						{trail.id === "elementar" && (
							<Link className="ui-link" href="/materiais/elementar/index.html">
								Ler a trilha completa · 60 passos{" "}
								<Icon className="size-4" name="arrow" />
							</Link>
						)}
						<figure className="trail-concept">
							<TrailDiagram id={trail.id} />
							<figcaption>
								<h2>{trail.diagramTitle}</h2>
								<p>{trail.diagramCaption}</p>
							</figcaption>
						</figure>
						<Link className="ui-link" href={`/disciplinas/${trail.id}`}>
							Conhecer a disciplina <Icon className="size-4" name="arrow" />
						</Link>
					</aside>
				</div>
			</div>
		</DashboardLayout>
	);
}
