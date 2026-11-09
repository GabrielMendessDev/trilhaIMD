import Link from "next/link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
	Progress,
} from "~/app/_components/dashboard";
import { auth, signOut } from "~/server/auth";

const subjects = [
	["Fundamentos Matemáticos", "6%", 6, "bg-violet-500"],
	["Introdução à Programação", "0%", 0, "bg-sky-500"],
	["Sistemas Digitais", "0%", 0, "bg-emerald-500"],
];
export default async function PerfilPage() {
	const user = (await auth())?.user;
	const name = user?.name || (user ? "Minha conta" : "Estudante IMD");

	return (
		<DashboardLayout active="/perfil">
			<div className="mx-auto max-w-4xl px-5 py-10 sm:px-10">
				<section className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
					<div className="grid size-24 place-items-center rounded-full bg-violet-500 font-black text-3xl text-white ring-8 ring-violet-100">
						{name.charAt(0).toUpperCase()}
					</div>
					<div className="min-w-0 flex-1">
						<h1 className="wrap-break-word font-black text-3xl">{name}</h1>
						<p className="wrap-break-word mt-1 font-semibold text-slate-500">
							{user
								? (user.email ?? "Conta Google")
								: "Estudante do Instituto Metrópole Digital"}
						</p>
						{user ? (
							<form
								action={async () => {
									"use server";
									await signOut({ redirectTo: "/login" });
								}}
								className="mt-4"
							>
								<button
									className="cursor-pointer rounded-xl border-2 border-slate-200 px-4 py-2 font-black text-slate-600 text-sm hover:bg-slate-50"
									type="submit"
								>
									Sair da conta
								</button>
							</form>
						) : (
							<Link
								className="mt-4 inline-block rounded-xl border-2 border-violet-200 bg-violet-50 px-4 py-2 font-black text-sm text-violet-700 hover:bg-violet-100"
								href="/login"
							>
								Entrar com o Google
							</Link>
						)}
					</div>
				</section>
				<div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{[
						["fire", "0", "sequência", "text-orange-500"],
						["bolt", "0", "XP total", "text-violet-500"],
						["check", "0", "lições", "text-emerald-500"],
						["ranking", "1", "nível", "text-sky-500"],
					].map(([icon, value, label, color]) => (
						<article
							className="rounded-2xl border-2 border-slate-100 bg-white p-4 text-center"
							key={label}
						>
							<Icon
								className={`mx-auto size-6 ${color}`}
								name={icon as "fire"}
							/>
							<strong className="mt-2 block font-black text-2xl">
								{value}
							</strong>
							<small className="font-bold text-slate-400">{label}</small>
						</article>
					))}
				</div>
				<section className="mt-11">
					<PageHeading
						description="Continue estudando para desbloquear novas unidades."
						title="Progresso nas disciplinas"
					/>
					<div className="space-y-3">
						{subjects.map(([title, percent, value, color]) => (
							<article
								className="flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5"
								key={title}
							>
								<span
									className={`grid size-11 place-items-center rounded-xl ${color} text-white`}
								>
									<Icon className="size-6" name="learn" />
								</span>
								<div className="flex-1">
									<div className="mb-2 flex justify-between gap-4">
										<strong>{title}</strong>
										<span className="font-black text-slate-400">{percent}</span>
									</div>
									<Progress color={color as string} value={value as number} />
								</div>
							</article>
						))}
					</div>
				</section>
				<section className="mt-8 flex flex-col gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5 sm:flex-row sm:items-center">
					<div className="flex-1">
						<h2 className="font-black">Preferências</h2>
						<p className="mt-1 font-semibold text-slate-500 text-sm">
							Personalize sua experiência de estudo neste dispositivo.
						</p>
					</div>
					<button
						className="rounded-xl border-2 border-slate-200 px-4 py-2.5 font-black text-sm"
						type="button"
					>
						Tema escuro
					</button>
				</section>
			</div>
		</DashboardLayout>
	);
}
