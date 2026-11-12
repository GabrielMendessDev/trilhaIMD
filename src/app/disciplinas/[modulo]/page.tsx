import { notFound } from "next/navigation";
import Link from "~/app/_components/action-link";
import { CourseChapters } from "~/app/_components/course-chapters";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { JourneyBanner } from "~/app/_components/journey-banner";
import { trailMapHref, trails } from "~/app/aprender/trails";
import { auth } from "~/server/auth";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
export default async function DisciplinaPage({
	params,
}: {
	params: Promise<{ modulo: string }>;
}) {
	const { modulo } = await params;
	const trail = trails.find((t) => t.id === modulo);
	if (!trail) notFound();
	const user = (await auth())?.user;
	const [points, progress] = await Promise.all([
		getPublishedPoints(),
		user ? getLearningProgress(user.id) : null,
	]);
	const { published, completed, next } = getTrailStatus(
		points ?? [],
		progress,
		trail.id,
	);
	return (
		<DashboardLayout active="/disciplinas">
			<div className="ui-page course-page">
				<Link className="ui-link course-back" href="/disciplinas">
					<Icon className="size-4 rotate-90" name="chevron" /> Disciplinas
				</Link>
				<PageHeading description={trail.description} title={trail.name} />
				<JourneyBanner
					completed={completed.length}
					href={next ? `/aprender/${trail.id}/${next.number}` : undefined}
					next={next}
					total={published.length}
					trail={trail}
				/>
				<CourseChapters
					completed={completed.map((p) => p.number)}
					current={progress ? next?.number : undefined}
					points={published}
					trail={trail.id}
				/>
				<Link className="ui-button" href={trailMapHref(trail.id, next?.number)}>
					Explorar o mapa <Icon className="size-4" name="arrow" />
				</Link>
			</div>
		</DashboardLayout>
	);
}
