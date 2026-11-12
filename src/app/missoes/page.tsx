import Link from "~/app/_components/action-link";
import { DailyMissions } from "~/app/_components/daily-missions";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { auth } from "~/server/auth";
import { getStudyInsights } from "~/server/study-insights";
export const metadata = { title: "Missões de hoje" };
export default async function MissoesPage() {
	const user = (await auth())?.user;
	const insights = user ? await getStudyInsights(user.id) : null;
	return (
		<DashboardLayout active="/conquistas">
			<div className="ui-page missions-page">
				<PageHeading
					description="Faça um pouco hoje. Seu progresso é salvo enquanto você aprende."
					title="Pequenas metas. Novas descobertas."
				/>
				<DailyMissions daily={insights?.daily ?? null} />
				<Link className="ui-button" href={user ? "/aprender" : "/login"}>
					{user ? "Continuar estudando" : "Entrar para acompanhar"}
					<Icon className="size-4" name="arrow" />
				</Link>
				<Link className="ui-link" href="/conquistas">
					Explorar conquistas
				</Link>
			</div>
		</DashboardLayout>
	);
}
