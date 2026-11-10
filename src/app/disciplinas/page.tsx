import { DashboardLayout, PageHeading } from "~/app/_components/dashboard";
import { TrailCard } from "~/app/_components/trail-card";
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
			<div className="ui-page">
				<PageHeading
					description="Escolha uma disciplina do BTI para abrir seu mapa de estudo."
					title="Disciplinas"
				/>
				{!points && (
					<p className="study-error mb-4">
						O catálogo de lições está temporariamente indisponível.
					</p>
				)}
				<ul className="grid gap-4 min-[1350px]:grid-cols-3 min-[620px]:grid-cols-2">
					{trails.map((trail) => {
						const { published, completed, next } = getTrailStatus(
							points ?? [],
							progress,
							trail.id,
						);
						return (
							<li key={trail.id}>
								<TrailCard
									completed={progress ? completed.length : null}
									stage={next?.number}
									total={published.length}
									trail={trail}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		</DashboardLayout>
	);
}
