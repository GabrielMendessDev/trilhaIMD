import {
	DashboardLayout,
	Icon,
	PageHeading,
	Progress,
} from "~/app/_components/dashboard";

const quests = [
	["Complete uma lição", "0/1", 0, "20 XP"],
	["Ganhe 20 XP", "0/20", 0, "15 gemas"],
	["Acerte 5 questões", "0/5", 0, "10 gemas"],
];
const medals = [
	["Primeiro passo", "Conclua sua primeira lição", "star"],
	["Ritmo constante", "Estude por 3 dias seguidos", "fire"],
	["Mente afiada", "Acerte 25 questões", "bolt"],
] as const;
export default function MissoesPage() {
	return (
		<DashboardLayout active="/missoes">
			<div className="mx-auto max-w-3xl px-5 py-10 sm:px-10">
				<PageHeading
					description="Complete objetivos diários para ganhar gemas e avançar mais rápido."
					title="Missões"
				/>
				<section className="space-y-3">
					{quests.map(([title, detail, value, prize]) => (
						<article
							className="flex gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5"
							key={title}
						>
							<span className="grid size-12 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
								<Icon className="size-6" name="quests" />
							</span>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap justify-between gap-2">
									<h2 className="font-black">{title}</h2>
									<span className="font-black text-sky-500 text-sm">
										{prize}
									</span>
								</div>
								<div className="mt-3 flex items-center gap-3">
									<Progress value={value as number} />
									<span className="shrink-0 font-black text-slate-400 text-sm">
										{detail}
									</span>
								</div>
							</div>
						</article>
					))}
				</section>
				<h2 className="mt-11 mb-5 font-black text-xl">Conquistas</h2>
				<div className="grid gap-3 sm:grid-cols-3">
					{medals.map(([title, desc, icon]) => (
						<article
							className="rounded-2xl border-2 border-slate-100 bg-white p-5 text-center"
							key={title}
						>
							<span className="mx-auto grid size-13 place-items-center rounded-full bg-slate-100 text-slate-400">
								<Icon className="size-7" name={icon} />
							</span>
							<h3 className="mt-3 font-black">{title}</h3>
							<p className="mt-1 font-semibold text-slate-400 text-sm leading-snug">
								{desc}
							</p>
						</article>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
