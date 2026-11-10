import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { TrailCard } from "~/app/_components/trail-card";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { trails } from "../aprender/trails";

export const metadata = { title: "Progresso" };

export default async function ProgressoPage() {
	const user = (await auth())?.user;
	const [points, progress] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
	]);

	return (
		<DashboardLayout active="/progresso">
			<div className="ui-page">
				<PageHeading
					description="Acompanhe as etapas concluídas, seu XP e sua ofensiva."
					title="Seu progresso"
				/>
				{progress ? (
					<>
						<ul className="mb-6 grid gap-3 sm:grid-cols-3">
							<li className="ui-panel p-4">
								<Icon className="mb-2 size-5 text-[var(--accent)]" name="gem" />
								<p className="font-display font-extrabold text-2xl">
									{progress.xp} XP
								</p>
								<p className="ui-muted text-sm">XP acumulado</p>
							</li>
							<li className="ui-panel p-4">
								<Icon
									className="mb-2 size-5 text-[var(--warm-ink)]"
									name="fire"
								/>
								<p className="font-display font-extrabold text-2xl">
									{progress.streak}
								</p>
								<p className="ui-muted text-sm">Dias de ofensiva</p>
							</li>
							<li className="ui-panel p-4">
								<Icon
									className="mb-2 size-5 text-[var(--success-ink)]"
									name="check"
								/>
								<p className="font-display font-extrabold text-2xl">
									{progress.done.length}
								</p>
								<p className="ui-muted text-sm">Etapas concluídas</p>
							</li>
						</ul>
						{!points?.length && (
							<p className="ui-muted mb-4">
								As trilhas vão mostrar seu progresso quando houver lições
								publicadas.
							</p>
						)}
						<ul className="grid gap-4 min-[620px]:grid-cols-2">
							{trails.map((trail) => {
								const { published, completed, next } = getTrailStatus(
									points ?? [],
									progress,
									trail.id,
								);
								return published.length ? (
									<li key={trail.id}>
										<TrailCard
											completed={completed.length}
											stage={next?.number}
											total={published.length}
											trail={trail}
										/>
									</li>
								) : null;
							})}
						</ul>
					</>
				) : (
					<section className="ui-panel max-w-xl p-6">
						<h2 className="font-extrabold text-xl">
							{user ? "Progresso indisponível" : "Estude com sua conta"}
						</h2>
						<p className="ui-muted mt-2">
							{user
								? "Tente acessar novamente em instantes."
								: "Entre para registrar as etapas que concluir."}
						</p>
						{!user && (
							<Link className="ui-button mt-4" href="/login">
								Entrar com Google
							</Link>
						)}
					</section>
				)}
			</div>
		</DashboardLayout>
	);
}
