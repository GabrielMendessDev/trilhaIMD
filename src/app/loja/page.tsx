import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";

const items = [
	["Recuperar corações", "Volte imediatamente para 5 corações.", "heart", "50"],
	[
		"Proteção de sequência",
		"Protege automaticamente um dia perdido.",
		"shield",
		"100",
	],
	["Dobro de XP", "Suas próximas 3 lições rendem XP em dobro.", "bolt", "150"],
] as const;
export default function LojaPage() {
	return (
		<DashboardLayout active="/loja">
			<div className="mx-auto max-w-3xl px-5 py-10 sm:px-10">
				<PageHeading
					description="Gemas são conquistadas estudando, concluindo missões e mantendo sua sequência."
					title="Use suas gemas"
				/>
				<div className="mb-7 flex items-center justify-between rounded-2xl bg-sky-500 px-6 py-5 text-white shadow-[0_4px_0_#0284c7]">
					<span className="font-bold">Seu saldo</span>
					<span className="flex items-center gap-2 font-black text-2xl">
						<Icon className="size-7 fill-sky-200" name="gem" />
						120
					</span>
				</div>
				<section className="space-y-3">
					{items.map(([title, desc, icon, cost]) => (
						<article
							className="flex flex-col gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5 sm:flex-row sm:items-center"
							key={title}
						>
							<span className="grid size-13 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
								<Icon className="size-7" name={icon} />
							</span>
							<div className="flex-1">
								<h2 className="font-black">{title}</h2>
								<p className="mt-1 font-semibold text-slate-500">{desc}</p>
								{title === "Proteção de sequência" && (
									<small className="mt-2 block font-semibold text-slate-400">
										Você não possui proteção.
									</small>
								)}
							</div>
							<button
								className="flex items-center justify-center gap-1 rounded-xl bg-sky-500 px-4 py-2.5 font-black text-white shadow-[0_4px_0_#0369a1] hover:bg-sky-400"
								type="button"
							>
								<Icon className="size-4 fill-sky-200" name="gem" />
								{cost}
							</button>
						</article>
					))}
				</section>
			</div>
		</DashboardLayout>
	);
}
