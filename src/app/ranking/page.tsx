import { DashboardLayout, Icon } from "~/app/_components/dashboard";

const people = [
	["Ana Beatriz", "1.420", "AB"],
	["João Victor", "1.270", "JV"],
	["Marina Costa", "1.110", "MC"],
	["Você", "860", "E"],
	["Lucas Freire", "810", "LF"],
	["Clara Nunes", "760", "CN"],
];
export default function RankingPage() {
	return (
		<DashboardLayout active="/ranking">
			<div className="mx-auto max-w-3xl px-5 py-10 sm:px-10">
				<header className="text-center">
					<div className="mx-auto grid size-20 place-items-center rounded-full bg-violet-100 text-violet-600">
						<Icon className="size-10 fill-violet-200" name="ranking" />
					</div>
					<h1 className="mt-4 font-black text-4xl">Liga Prata</h1>
					<p className="mx-auto mt-2 max-w-lg font-semibold text-slate-500">
						Os 10 primeiros sobem de divisão. A classificação usa o XP ganho
						nesta semana.
					</p>
					<span className="mt-4 inline-block rounded-full bg-slate-100 px-4 py-2 font-black text-slate-500 text-sm">
						Termina em 3 dias
					</span>
				</header>
				<section className="mt-9 overflow-hidden rounded-2xl border-2 border-slate-100 bg-white">
					{people.map(([name, xp, initials], index) => (
						<div
							className={`flex items-center gap-4 px-5 py-4 ${name === "Você" ? "bg-violet-50" : ""} ${index < people.length - 1 ? "border-slate-100 border-b" : ""}`}
							key={name}
						>
							<strong
								className={`w-7 text-center text-lg ${index < 3 ? "text-violet-600" : "text-slate-400"}`}
							>
								#{index + 1}
							</strong>
							<span
								className={`grid size-10 place-items-center rounded-full font-black text-sm ${name === "Você" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}
							>
								{initials}
							</span>
							<strong className="flex-1">{name}</strong>
							<span className="font-black text-violet-600">{xp} XP</span>
						</div>
					))}
				</section>
			</div>
		</DashboardLayout>
	);
}
