import {
	DashboardLayout,
	Icon,
	PageHeading,
	Progress,
} from "~/app/_components/dashboard";

const courses = [
	["Fundamentos Matemáticos", "1 de 16 lições", 6, "bg-violet-500"],
	["Introdução à Programação", "0 de 18 lições", 0, "bg-sky-500"],
	["Sistemas Digitais", "0 de 14 lições", 0, "bg-emerald-500"],
];
export default function PraticarPage() {
	return (
		<DashboardLayout active="/praticar">
			<div className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
				<PageHeading
					description="Questões são escolhidas entre conteúdos que você já desbloqueou."
					title="Pratique o que você já estudou"
				/>
				<section className="flex flex-col gap-6 rounded-3xl bg-violet-600 p-7 text-white shadow-[0_5px_0_#4c36be] sm:flex-row sm:items-center">
					<span className="grid size-[72px] shrink-0 place-items-center rounded-2xl bg-white/15">
						<Icon className="size-10" name="practice" />
					</span>
					<div className="flex-1">
						<span className="font-black text-violet-200 text-xs tracking-widest">
							RECOMENDADO
						</span>
						<h2 className="mt-1 font-black text-2xl">Prática personalizada</h2>
						<p className="mt-1 font-semibold text-violet-100">
							Misture assuntos das suas trilhas e fortaleça os pontos já
							estudados.
						</p>
					</div>
					<button
						className="rounded-xl bg-white px-5 py-3 font-black text-sm text-violet-700 shadow-[0_3px_0_#ddd6fe] hover:bg-violet-50"
						type="button"
					>
						COMEÇAR PRÁTICA
					</button>
				</section>
				<h2 className="mt-12 mb-5 font-black text-xl">
					Revisar por disciplina
				</h2>
				<div className="grid gap-4 md:grid-cols-3">
					{courses.map(([name, detail, progress, color]) => (
						<article
							className="rounded-2xl border-2 border-slate-100 bg-white p-5"
							key={name}
						>
							<div
								className={`grid size-11 place-items-center rounded-xl ${color} text-white`}
							>
								<Icon className="size-6" name="learn" />
							</div>
							<h3 className="mt-4 font-black text-slate-800">{name}</h3>
							<p className="mt-1 font-semibold text-slate-400 text-sm">
								{detail}
							</p>
							<div className="mt-4">
								<Progress color={color as string} value={progress as number} />
							</div>
							<button
								className="mt-5 w-full rounded-xl border-2 border-slate-200 py-2.5 font-black text-slate-500 text-xs disabled:cursor-not-allowed disabled:opacity-50"
								disabled={progress === 0}
								type="button"
							>
								PRATICAR
							</button>
						</article>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
