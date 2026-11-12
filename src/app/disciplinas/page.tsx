import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
	ProgressBar,
} from "~/app/_components/dashboard";
import { TrailSymbol } from "~/app/_components/trail-symbol";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { trails } from "../aprender/trails";
export const metadata = { title: "Disciplinas" };
export default async function DisciplinasPage() {
	const user = (await auth())?.user;
	const [points, progress] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
	]);
	return (
		<DashboardLayout active="/disciplinas">
			<div className="ui-page disciplines-page">
				<PageHeading
					description="Encontre a disciplina que faz parte da sua jornada em TI."
					title="O que vamos aprender?"
				/>
				{!points && (
					<p className="study-error">
						O catálogo está temporariamente indisponível. Tente novamente em
						instantes.
					</p>
				)}
				<div className="discipline-library">
					{trails.map((t) => {
						const { published, completed, next } = getTrailStatus(
							points ?? [],
							progress,
							t.id,
						);
						return (
							<Link
								className="course-row"
								data-trail={t.id}
								href={`/disciplinas/${t.id}`}
								key={t.id}
							>
								<span className="course-art">
									<TrailSymbol id={t.id} />
								</span>
								<div>
									<h2>{t.name}</h2>
									<p>{t.description}</p>
									<div className="course-meta">
										<span>
											{published.length ? "1 unidade" : "Em preparação"}
										</span>
										<span>{published.length} lições publicadas</span>
									</div>
									{published.length > 0 && (
										<ProgressBar
											label={`Progresso em ${t.name}`}
											value={(completed.length / published.length) * 100}
										/>
									)}
									<small>
										{next
											? `Próxima: ${next.title ?? `Lição ${next.number}`}`
											: published.length
												? "Jornada concluída. Você pode revisitar os conceitos."
												: "Explore os materiais introdutórios."}
									</small>
								</div>
								<Icon className="size-5" name="arrow" />
							</Link>
						);
					})}
				</div>
			</div>
		</DashboardLayout>
	);
}
