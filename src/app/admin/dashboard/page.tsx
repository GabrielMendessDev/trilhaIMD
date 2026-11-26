import type { Metadata } from "next";
import { ActionButton } from "~/app/_components/action-button";
import {
	adminSession,
	adminSetupAvailable,
	adminSetupRequiresToken,
	readAdminCredentials,
} from "~/server/admin-auth";
import { readAdminMetrics } from "~/server/admin-metrics";
import { pruneAnalytics } from "~/server/analytics";
import { leaveAdmin } from "./actions";
import { AdminSetup } from "./admin-setup";
import { AdminSignIn } from "./admin-sign-in";
import { DashboardMetrics } from "./metrics-sections";
import styles from "./styles.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Painel administrativo",
	robots: { index: false, follow: false },
};

const date = (day: string) => day.split("-").reverse().join("/");

export default async function AdminDashboard({
	searchParams,
}: {
	searchParams: Promise<{ erro?: string }>;
}) {
	const credentials = await readAdminCredentials().catch(() => ({
		mode: "disabled" as const,
	}));
	const session = await adminSession(credentials);
	if (session !== "admin") {
		const { erro } = await searchParams;
		if (session === "setup")
			return (
				<AdminSetup
					available={adminSetupAvailable()}
					invalid={erro === "setup"}
					requiresToken={adminSetupRequiresToken()}
				/>
			);
		return (
			<AdminSignIn
				available={credentials.mode !== "disabled"}
				firstAccess={credentials.mode === "setup"}
				invalid={erro === "1"}
			/>
		);
	}

	const data = await readAdminMetrics().catch((error: unknown) => {
		console.error(
			"Painel de métricas indisponível.",
			error instanceof Error ? error.message : "",
		);
		return null;
	});
	await pruneAnalytics().catch(() =>
		console.error("Limpeza das métricas indisponível."),
	);

	return (
		<main className={styles.dashboard}>
			<header className={styles.header}>
				<div>
					<h1>Métricas do trilbit</h1>
					{data && (
						<p>
							{date(data.firstDay)} a {date(data.today)} · Horário de Brasília
						</p>
					)}
				</div>
				<form action={leaveAdmin}>
					<ActionButton
						busyLabel="Saindo…"
						className="ui-button"
						data-variant="secondary"
						type="submit"
					>
						Sair do painel
					</ActionButton>
				</form>
			</header>
			{!data ? (
				<p className={styles.error} role="alert">
					Não foi possível consultar as métricas. Confira a conexão com o banco
					e a migração do painel.
				</p>
			) : (
				<DashboardMetrics data={data} />
			)}
		</main>
	);
}
