import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	ProgressBar,
} from "~/app/_components/dashboard";
import { UnlockEffect } from "~/app/_components/reward-effects";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { stagesByTrail } from "./_etapa/stages";
import styles from "./trail.module.css";
import { TrailDiagram } from "./trail-diagram";
import { TrailMap } from "./trail-map";
import { trailMapHref, trails } from "./trails";

export default async function AprenderPage({
	searchParams,
}: {
	searchParams: Promise<{
		modulo?: string | string[];
		etapa?: string | string[];
		concluida?: string | string[];
	}>;
}) {
	const { modulo, etapa, concluida } = await searchParams;
	const trail = trails.find(({ id }) => id === modulo) ?? trails[0];
	const user = (await auth())?.user;
	const [catalog, progress] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
	]);
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		trail.id,
	);
	const completedPoint = completed.find(
		(point) => String(point.number) === concluida,
	);
	const reward = progress?.done.find(
		(row) => row.pointId === completedPoint?.id,
	)?.xp;
	const selected =
		trail.positions.findIndex((_, index) => String(index + 1) === etapa) + 1 ||
		next?.number ||
		1;
	const percent =
		progress && published.length
			? Math.round((100 * completed.length) / published.length)
			: null;
	const latest = progress?.done
		.filter((row) => completed.some(({ id }) => id === row.pointId))
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
			<div
				className={`${styles.page} ${styles.trailTheme}`}
				data-trail={trail.id}
			>
				<header className={styles.pageHeader}>
					<div>
						<h1 className="font-black text-2xl tracking-tight sm:text-4xl min-[481px]:text-3xl">
							Trilhas de matemática
						</h1>
						<p className="ui-muted mt-1.5 font-semibold">
							Escolha um módulo para explorar.
						</p>
					</div>
				</header>
				{completedPoint && reward !== undefined && (
					<p className="study-success mb-4" role="status">
						Etapa {completedPoint.number} concluída · {reward} XP registrados
					</p>
				)}

				<nav aria-label="Módulos de matemática" className={styles.moduleNav}>
					{trails.map((module) => (
						<Link
							aria-current={module.id === trail.id ? "page" : undefined}
							className={styles.moduleLink}
							data-trail={module.id}
							href={trailMapHref(module.id)}
							key={module.id}
							scroll={false}
							title={module.name}
						>
							<span aria-hidden="true" className={styles.moduleSymbol}>
								{module.notation}
							</span>
							{module.label}
						</Link>
					))}
				</nav>

				<div className={styles.content}>
					<section aria-labelledby="module-title" className={styles.board}>
						<header className={styles.moduleHeader}>
							<span aria-hidden="true" className={styles.heroSymbol}>
								{trail.notation}
							</span>
							<div className={styles.moduleIdentity}>
								<h2
									className="text-balance font-black text-2xl leading-tight min-[481px]:text-3xl"
									id="module-title"
								>
									{trail.name}
									{trail.id === "fmc" && " (FMC 1)"}
								</h2>
								<p className={styles.moduleDescription}>{trail.description}</p>
								<p className={styles.moduleCount}>
									{trail.positions.length} pontos · {published.length} etapas
									publicadas
								</p>
								{percent !== null && (
									<div className={styles.moduleProgress}>
										<ProgressBar
											label={`Progresso em ${trail.name}`}
											value={percent}
										/>
										<span>{percent}%</span>
									</div>
								)}
							</div>
						</header>
						<TrailMap
							completedStages={completed.map(({ number }) => number)}
							currentStage={next?.number}
							initialStage={selected}
							key={`${trail.id}-${selected}`}
							previewStages={Object.keys(stagesByTrail[trail.id] ?? {}).map(
								Number,
							)}
							publishedStages={published.map(({ number, title }) => ({
								number,
								title,
							}))}
							sequential={Boolean(progress)}
							trail={trail}
						/>
					</section>

					<aside aria-label="Detalhes do módulo" className={styles.sidebar}>
						<figure className={styles.figure}>
							<TrailDiagram id={trail.id} />
							<figcaption>
								<h3 className="font-black">{trail.diagramTitle}</h3>
								<p className="ui-muted mt-1 font-medium text-sm leading-relaxed">
									{trail.diagramCaption}
								</p>
							</figcaption>
						</figure>

						<div className={styles.guide}>
							<h3 className="font-black">Como ler o mapa</h3>
							<p className="ui-muted mt-1 text-sm leading-relaxed">
								Os círculos marcam etapas, as estrelas indicam desafios e o
								cadeado sinaliza um pré-requisito.
							</p>
						</div>

						<div className={styles.quickLinks}>
							<Link href="/ranking">
								<Icon className="size-5" name="ranking" />
								Liga Acadêmica
							</Link>
							<Link href="/conquistas">
								<Icon className="size-5" name="trophy" />
								Conquistas
							</Link>
						</div>
					</aside>
				</div>
			</div>
		</DashboardLayout>
	);
}
