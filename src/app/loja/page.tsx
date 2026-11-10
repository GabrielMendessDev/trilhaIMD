import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";

const items = [
	{
		title: "Recuperar corações",
		description: "Voltar a ter cinco corações.",
		icon: "heart",
		cost: 50,
	},
	{
		title: "Proteção de sequência",
		description: "Proteger um dia perdido na sequência.",
		icon: "shield",
		cost: 100,
	},
	{
		title: "Dobro de XP",
		description: "Ganhar XP em dobro nas próximas três lições.",
		icon: "bolt",
		cost: 150,
	},
] as const;

export default function LojaPage() {
	return (
		<DashboardLayout active="/loja">
			<div className="ui-page">
				<PageHeading
					description="Conheça os itens previstos para resgate com gemas."
					title="Loja"
				/>
				<section
					aria-labelledby="shop-title"
					className="ui-panel max-w-3xl p-5 sm:p-7"
				>
					<h2 className="font-extrabold text-xl" id="shop-title">
						Resgates em preparação
					</h2>
					<ul className="mt-3 divide-y divide-[var(--line)]">
						{items.map(({ title, description, icon, cost }) => (
							<li
								className="flex flex-wrap items-center gap-3 py-4"
								key={title}
							>
								<span className="ui-icon">
									<Icon className="size-5" name={icon} />
								</span>
								<div className="min-w-[8rem] flex-1">
									<h3 className="font-extrabold text-sm">{title}</h3>
									<p className="ui-muted mt-1 text-sm">{description}</p>
								</div>
								<span className="ui-muted inline-flex items-center gap-1 font-bold text-xs">
									<Icon className="size-4" name="gem" /> {cost} gemas
								</span>
							</li>
						))}
					</ul>
				</section>
			</div>
		</DashboardLayout>
	);
}
