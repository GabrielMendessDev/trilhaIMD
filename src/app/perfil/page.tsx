import { ActionButton } from "~/app/_components/action-button";
import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { ThemeToggle } from "~/app/_components/theme-toggle";
import { auth, signOut } from "~/server/auth";

export default async function PerfilPage() {
	const user = (await auth())?.user;
	const name = user?.name || (user ? "Minha conta" : "Visitante");

	return (
		<DashboardLayout active="/perfil">
			<div className="ui-page">
				<PageHeading
					description="Gerencie sua conta e personalize sua área de estudo."
					title="Perfil"
				/>
				<section className="ui-panel flex flex-wrap items-center gap-4 p-5 sm:p-7">
					<span className="ui-icon size-14 font-extrabold text-xl">
						{user ? (
							Array.from(name)[0]?.toUpperCase()
						) : (
							<Icon className="size-6" name="profile" />
						)}
					</span>
					<div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
						<h2 className="font-extrabold text-lg">{name}</h2>
						<p className="ui-muted mt-1 text-sm">
							{user
								? (user.email ?? "Conta Google")
								: "Acesse com sua conta Google."}
						</p>
					</div>
					{user ? (
						<form
							action={async () => {
								"use server";
								await signOut({ redirectTo: "/login" });
							}}
						>
							<ActionButton
								busyLabel="Saindo…"
								className="ui-button"
								data-variant="secondary"
								type="submit"
							>
								Sair da conta
							</ActionButton>
						</form>
					) : (
						<Link className="ui-button" href="/login">
							Entrar com o Google
						</Link>
					)}
				</section>

				<div className="mt-4 grid gap-4 min-[720px]:grid-cols-2">
					<section className="ui-panel p-5 sm:p-7">
						<h2 className="font-extrabold text-xl">
							Progresso nas disciplinas
						</h2>
						<p className="ui-muted mt-2 max-w-prose text-sm">
							Veja as etapas concluídas, o XP acumulado e sua ofensiva.
						</p>
						<Link
							className="ui-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm"
							href="/progresso"
						>
							Ver progresso <Icon className="size-4" name="arrow" />
						</Link>
					</section>
					<section className="ui-panel p-5 sm:p-7">
						<h2 className="font-extrabold text-xl">Aparência</h2>
						<p className="ui-muted mt-2 mb-4 text-sm">
							A preferência de tema fica salva neste dispositivo.
						</p>
						<ThemeToggle withLabel />
					</section>
				</div>
				<nav
					aria-label="Outras áreas"
					className="mt-5 flex flex-wrap gap-4 text-sm"
				>
					<Link className="ui-link" href="/ranking">
						Ranking
					</Link>
					<Link className="ui-link" href="/loja">
						Loja
					</Link>
					<Link className="ui-link" href="/missoes">
						Missões diárias
					</Link>
				</nav>
			</div>
		</DashboardLayout>
	);
}
