import Link from "next/link";
import {
	DashboardLayout,
	Icon,
	Progress,
	Status,
} from "~/app/_components/dashboard";

const lessons = [
	["Proposições e valores lógicos", "Introdução", "current"],
	["Conectivos lógicos", "Lição 2", "locked"],
	["Tabelas-verdade", "Lição 3", "locked"],
	["Desafio da unidade", "Baú de XP", "locked"],
] as const;

export default function AprenderPage() {
	return (
		<DashboardLayout active="/aprender">
			<div className="mx-auto grid max-w-7xl gap-10 px-5 py-7 xl:grid-cols-[minmax(0,650px)_330px] xl:px-10">
				<section>
					<header className="mb-7 flex items-center justify-between border-slate-100 border-b-2 pb-5">
						<div className="flex items-center gap-3">
							<span className="grid size-11 place-items-center rounded-xl bg-violet-600 font-black text-white shadow-[0_3px_0_#4c36be]">
								⌁
							</span>
							<div>
								<small className="font-black text-slate-400 uppercase tracking-wider">
									Trilha atual
								</small>
								<h2 className="font-black text-slate-800">
									Fundamentos Matemáticos
								</h2>
							</div>
						</div>
						<Icon className="size-5 text-slate-400" name="chevron" />
					</header>
					<article className="rounded-2xl bg-violet-600 p-6 text-white shadow-[0_5px_0_#4c36be] sm:p-7">
						<span className="font-black text-violet-200 text-xs tracking-widest">
							UNIDADE 1
						</span>
						<h1 className="mt-1 font-black text-3xl tracking-tight">
							Lógica e proposições
						</h1>
						<p className="mt-2 max-w-xl font-semibold text-violet-100 leading-relaxed">
							Construa a base para raciocinar com proposições, conectivos e
							tabelas-verdade.
						</p>
						<button
							className="mt-5 rounded-xl border-2 border-white/45 px-4 py-2.5 font-black text-xs tracking-wide transition hover:bg-white/15"
							type="button"
						>
							GUIA DA UNIDADE
						</button>
					</article>
					<div className="relative mx-auto mt-10 max-w-md space-y-7 before:absolute before:inset-x-1/2 before:top-12 before:h-[calc(100%-96px)] before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-slate-100">
						{lessons.map(([title, label, state], index) => (
							<div
								className="relative z-10 flex items-center gap-5"
								key={title}
							>
								<span
									className={`grid size-[68px] shrink-0 place-items-center rounded-2xl ${state === "current" ? "bg-violet-600 text-white shadow-[0_4px_0_#5b21b6]" : "bg-slate-200 text-slate-400 shadow-[0_4px_0_#cbd5e1]"}`}
								>
									{state === "current" ? (
										<Icon className="size-8 fill-current" name="star" />
									) : (
										<Icon
											className="size-7"
											name={index === 3 ? "shield" : "lock"}
										/>
									)}
								</span>
								<div className="min-w-0 flex-1 rounded-2xl border-2 border-slate-100 bg-white p-4">
									<small className="font-black text-slate-400 uppercase tracking-wider">
										{label}
									</small>
									<h2 className="mt-0.5 font-extrabold text-slate-700">
										{title}
									</h2>
									{state === "current" ? (
										<Link
											className="mt-2 inline-block font-black text-sm text-violet-600 hover:text-violet-800"
											href="/praticar"
										>
											COMEÇAR →
										</Link>
									) : (
										<p className="mt-1 font-semibold text-slate-400 text-sm">
											Conclua a etapa anterior para liberar.
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
				<aside className="space-y-5">
					<div className="hidden justify-end xl:flex">
						<Status />
					</div>
					<article className="rounded-2xl border-2 border-slate-100 bg-white p-5">
						<div className="flex items-center justify-between">
							<h2 className="font-black">Liga Acadêmica</h2>
							<Link
								className="font-black text-violet-600 text-xs"
								href="/ranking"
							>
								VER RANKING
							</Link>
						</div>
						<div className="mx-auto my-5 grid size-[88px] place-items-center rounded-full bg-violet-100 text-violet-600">
							<Icon className="size-11 fill-violet-200" name="ranking" />
						</div>
						<p className="text-center font-semibold text-slate-500">
							<strong className="text-slate-800 text-xl">#8</strong> na liga
							Prata
						</p>
						<p className="mt-2 text-center font-semibold text-slate-400 text-sm">
							Fique entre os 10 primeiros para subir.
						</p>
					</article>
					<article className="rounded-2xl border-2 border-slate-100 bg-white p-5">
						<div className="flex items-center justify-between">
							<h2 className="font-black">Missões do dia</h2>
							<Link
								className="font-black text-violet-600 text-xs"
								href="/missoes"
							>
								VER TODAS
							</Link>
						</div>
						<div className="mt-4 space-y-4">
							<div>
								<div className="mb-2 flex justify-between font-bold text-sm">
									<span>Concluir uma lição</span>
									<span className="text-violet-600">0/1</span>
								</div>
								<Progress value={0} />
							</div>
							<div>
								<div className="mb-2 flex justify-between font-bold text-sm">
									<span>Ganhar 20 XP</span>
									<span className="text-violet-600">0/20</span>
								</div>
								<Progress color="bg-sky-500" value={0} />
							</div>
						</div>
					</article>
					<article className="flex items-center gap-4 rounded-2xl bg-orange-50 p-5">
						<Icon
							className="size-10 fill-orange-400 text-orange-500"
							name="fire"
						/>
						<div>
							<h2 className="font-black">0 dias de sequência</h2>
							<p className="mt-1 font-semibold text-slate-500 text-sm leading-snug">
								Estude hoje para começar.
							</p>
						</div>
					</article>
				</aside>
			</div>
		</DashboardLayout>
	);
}
