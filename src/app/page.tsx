import Link from "~/app/_components/action-link";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { DashboardLayout, Icon } from "./_components/dashboard";
import { TrailCard } from "./_components/trail-card";
import { trailMapHref, trails } from "./aprender/trails";
import styles from "./home.module.css";

export default async function Home() {
	const user = (await auth())?.user;
	const name = user?.name?.trim().split(/\s+/)[0];
	const [catalog, progress] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
	]);
	const all = trails.map((trail) => ({
		trail,
		...getTrailStatus(catalog ?? [], progress, trail.id),
	}));
	const started = all.filter(({ published }) =>
		published.some((point) =>
			progress?.rows.some((row) => row.pointId === point.id),
		),
	);
	const suggestions = [all[0], all[3]].filter((item) => item !== undefined);
	const cards = [...new Set([...started, ...suggestions, ...all])].slice(0, 2);
	const goal = (
		started.find((item) => item.next) ?? all.find((item) => item.next)
	)?.next;
	const goalTrail = trails.find((trail) => trail.id === goal?.trail);
	const goalHref = goal
		? trailMapHref(goal.trail, goal.number)
		: "/disciplinas";

	return (
		<DashboardLayout active="/">
			<div className={`ui-page ${styles.home}`}>
				<header className={styles.greeting}>
					<h1>Olá, {name || "estudante"}!</h1>
					<p>Continue sua evolução em Tecnologia da Informação.</p>
				</header>

				<section aria-labelledby="my-trails">
					<header className={styles.sectionHeading}>
						<h2 id="my-trails">Minhas trilhas</h2>
						<Link className="ui-link" href="/disciplinas">
							Ver disciplinas <Icon className="size-4" name="arrow" />
						</Link>
					</header>
					{!started.length && (
						<p className="ui-muted mb-3 text-sm">
							Escolha uma disciplina para começar.
						</p>
					)}
					<ul className={styles.catalog}>
						{cards.map(({ trail, published, completed, next }) => (
							<li key={trail.id}>
								<TrailCard
									completed={progress ? completed.length : null}
									stage={next?.number}
									total={published.length}
									trail={trail}
								/>
							</li>
						))}
					</ul>
				</section>

				<section aria-labelledby="featured" className={styles.featured}>
					<h2 id="featured">Em destaque</h2>
					<Link className={styles.goal} href={goalHref}>
						<span className="ui-icon">
							<Icon className="size-6" name="flag" />
						</span>
						<div className="min-w-0">
							<h3>Próxima meta</h3>
							<p>
								{goal && goalTrail
									? "Conclua a etapa " +
										goal.number +
										" de " +
										goalTrail.name +
										"."
									: "Abra o catálogo e escolha a disciplina que você quer estudar."}
							</p>
						</div>
						{goal && (
							<span className={styles.reward}>
								<Icon className="size-4" name="sparkle" />+{goal.reward} XP
							</span>
						)}
						<Icon className="size-5 shrink-0" name="arrow" />
					</Link>
				</section>
			</div>
		</DashboardLayout>
	);
}
