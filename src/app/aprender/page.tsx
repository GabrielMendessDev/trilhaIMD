import Link from "next/link";
import { DashboardLayout, Icon, Status } from "~/app/_components/dashboard";
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
	}>;
}) {
	const { modulo, etapa } = await searchParams;
	const trail = trails.find(({ id }) => id === modulo) ?? trails[0];
	const selected =
		trail.positions.findIndex((_, index) => String(index + 1) === etapa) + 1 ||
		1;

	return (
		<DashboardLayout active="/aprender">
			<div
				className={`${styles.page} ${styles.trailTheme}`}
				data-trail={trail.id}
			>
				<header className={styles.pageHeader}>
					<div>
						<h1 className="font-black text-2xl tracking-tight sm:text-4xl min-[481px]:text-3xl">
							Trilhas de matemática
						</h1>
						<p className="mt-1.5 font-semibold text-slate-600">
							Escolha um módulo para explorar.
						</p>
					</div>
					<div className={styles.status}>
						<Status />
					</div>
				</header>

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
							<div>
								<h2
									className="text-balance font-black text-2xl leading-tight min-[481px]:text-3xl"
									id="module-title"
								>
									{trail.name}
									{trail.id === "fmc" && " (FMC 1)"}
								</h2>
								<p className={styles.moduleDescription}>{trail.description}</p>
								<p className={styles.moduleCount}>
									{trail.positions.length} etapas · 2 desafios
								</p>
							</div>
							<span aria-hidden="true" className={styles.heroSymbol}>
								{trail.notation}
							</span>
						</header>
						<TrailMap
							initialStage={selected}
							key={`${trail.id}-${selected}`}
							trail={trail}
						/>
					</section>

					<aside aria-label="Detalhes do módulo" className={styles.sidebar}>
						<figure className={styles.figure}>
							<TrailDiagram id={trail.id} />
							<figcaption>
								<h3 className="font-black">{trail.diagramTitle}</h3>
								<p className="mt-1 font-medium text-slate-600 text-sm leading-relaxed">
									{trail.diagramCaption}
								</p>
							</figcaption>
						</figure>

						<div className={styles.guide}>
							<h3 className="font-black">Como ler o mapa</h3>
							<p className="mt-1 text-slate-600 text-sm leading-relaxed">
								Os círculos marcam etapas. As estrelas indicam os desafios.
							</p>
						</div>

						<div className={styles.quickLinks}>
							<Link href="/ranking">
								<Icon className="size-5" name="ranking" />
								Liga Acadêmica
							</Link>
							<Link href="/missoes">
								<Icon className="size-5" name="quests" />
								Missões do dia
							</Link>
						</div>
					</aside>
				</div>
			</div>
		</DashboardLayout>
	);
}
