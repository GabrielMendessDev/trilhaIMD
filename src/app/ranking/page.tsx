import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";

export default function RankingPage() {
	return (
		<DashboardLayout active="/ranking">
			<div className="ui-page">
				<PageHeading
					description="Acompanhe a classificação da comunidade quando as ligas estiverem disponíveis."
					title="Ranking"
				/>
				<section className="ui-panel max-w-2xl p-5 sm:p-8">
					<span className="ui-icon">
						<Icon className="size-6" name="ranking" />
					</span>
					<h2 className="mt-4 font-extrabold text-xl">
						Liga acadêmica em preparação
					</h2>
					<p className="ui-muted mt-2 max-w-prose text-sm leading-relaxed">
						O ranking será exibido aqui quando houver resultados de estudo para
						comparar.
					</p>
					<Link className="ui-button mt-5" href="/aprender">
						Explorar trilhas <Icon className="size-4" name="arrow" />
					</Link>
				</section>
			</div>
		</DashboardLayout>
	);
}
