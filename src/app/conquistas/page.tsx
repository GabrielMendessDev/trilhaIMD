import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import styles from "~/app/_components/study.module.css";
import { auth } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
import {
	achievementDefinitions,
	earnedAchievements,
} from "~/server/learning-metrics";

export const metadata = { title: "Conquistas" };

export default async function ConquistasPage() {
	const user = (await auth())?.user;
	const progress = user ? await getLearningProgress(user.id) : null;
	const earned = new Set(
		progress ? earnedAchievements(progress).map(({ id }) => id) : [],
	);
	const awards = achievementDefinitions.map((award) => ({
		...award,
		earned: earned.has(award.id),
	}));

	return (
		<DashboardLayout active="/conquistas">
			<div className="ui-page">
				<PageHeading
					description="Medalhas que acompanham sua evolução nas trilhas."
					title="Conquistas"
				/>
				{!progress && (
					<p className="ui-muted mb-4">
						{user
							? "Seu progresso está indisponível no momento."
							: "Entre para acompanhar as medalhas da sua conta."}
					</p>
				)}
				<ul className="grid gap-4 min-[680px]:grid-cols-3">
					{awards.map((award) => (
						<li className="ui-panel p-5" key={award.name}>
							<span
								className={styles.medal}
								data-earned={award.earned}
								data-tone={award.tone}
							>
								<Icon
									className="size-6"
									name={progress && !award.earned ? "lock" : award.icon}
								/>
							</span>
							<h2 className="mt-4 font-extrabold">{award.name}</h2>
							<p className="ui-muted mt-1 text-sm">{award.condition}</p>
							{progress && (
								<p
									className={`mt-3 font-bold text-xs ${award.earned ? "text-[var(--success-ink)]" : "ui-muted"}`}
								>
									{award.earned ? "Conquistada" : "Bloqueada"}
								</p>
							)}
						</li>
					))}
				</ul>
				<Link className="ui-button mt-5" href={user ? "/aprender" : "/login"}>
					{user ? "Ver trilhas" : "Entrar com Google"}
				</Link>
			</div>
		</DashboardLayout>
	);
}
