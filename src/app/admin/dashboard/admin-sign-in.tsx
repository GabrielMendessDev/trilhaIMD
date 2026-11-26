import Link from "next/link";
import { ActionButton } from "~/app/_components/action-button";
import { enterAdmin } from "./actions";
import styles from "./styles.module.css";
export function AdminSignIn({
	available,
	firstAccess,
	invalid,
}: {
	available: boolean;
	firstAccess: boolean;
	invalid: boolean;
}) {
	return (
		<main className={styles.signIn}>
			<Link className="ui-link" href="/">
				trilbit
			</Link>
			<h1>Painel administrativo</h1>
			<p>
				{firstAccess
					? "No primeiro acesso, entre com as credenciais temporárias para criar seu próprio login e senha."
					: "Entre para consultar as métricas do trilbit."}
			</p>
			{available ? (
				<form action={enterAdmin} className={styles.form}>
					<label>
						Usuário
						<input
							autoComplete="username"
							maxLength={256}
							name="username"
							required
						/>
					</label>
					<label>
						Senha
						<input
							autoComplete="current-password"
							maxLength={1024}
							name="password"
							required
							type="password"
						/>
					</label>
					{invalid && (
						<p className={styles.error} role="alert">
							Usuário ou senha incorretos.
						</p>
					)}
					<ActionButton
						busyLabel="Entrando…"
						className="ui-button"
						type="submit"
					>
						Entrar
					</ActionButton>
				</form>
			) : (
				<p role="alert">
					Verifique as credenciais do painel e as migrações do banco de dados.
				</p>
			)}
		</main>
	);
}
