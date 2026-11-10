import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";

const milestones = [
	{
		title: "Primeiro passo",
		description: "Concluir a primeira lição.",
		icon: "star",
	},
	{
		title: "Ritmo constante",
		description: "Estudar por três dias seguidos.",
		icon: "fire",
	},
	{ title: "Mente afiada", description: "Acertar 25 questões.", icon: "bolt" },
] as const;

export default function MissoesPage() {
	return (
		<DashboardLayout active="/conquistas">
			<div className="ui-page">
				<PageHeading
					description="Conheça os marcos de estudo previstos para as trilhas."
					title="Missões e conquistas"
				/>
				<section className="ui-panel p-5 sm:p-7">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h2 className="font-extrabold text-xl">
								Missões diárias em preparação
							</h2>
							<p className="ui-muted mt-2 text-sm">
								Os objetivos e as recompensas vão aparecer aqui quando forem
								ativados.
							</p>
						</div>
						<Link
							className="ui-button"
							data-variant="secondary"
							href="/aprender"
						>
							Ver trilhas
						</Link>
					</div>
				</section>
				<section aria-labelledby="achievements-title" className="mt-7">
					<h2 className="mb-3 font-extrabold text-xl" id="achievements-title">
						Prévia das conquistas
					</h2>
					<div className="grid gap-3 min-[640px]:grid-cols-3">
						{milestones.map(({ title, description, icon }) => (
							<article className="ui-panel p-4 sm:p-5" key={title}>
								<span className="ui-icon">
									<Icon className="size-5" name={icon} />
								</span>
								<h3 className="mt-3 font-extrabold">{title}</h3>
								<p className="ui-muted mt-1 text-sm">{description}</p>
							</article>
						))}
					</div>
				</section>
			</div>
		</DashboardLayout>
	);
}
