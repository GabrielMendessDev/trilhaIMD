import Link from "next/link";
import { ActionButton } from "~/app/_components/action-button";
import { enterAdmin } from "./actions";
import styles from "./styles.module.css";
export function AdminSignIn({
	available,
	firstAccess,
	invalid,
	weakEnvironmentPassword,
}: {
	available: boolean;
	firstAccess: boolean;
	invalid: boolean;
	weakEnvironmentPassword: boolean;
}) {
	return (
		<main className={styles.signIn}>
			<Link className="ui-link" href="/">
				trilbit
			</Link>
			<h1>Painel administrativo</h1>
			<p>
				{firstAccess
					? "No primeiro acesso, use admin como usuário e senha para iniciar a configuração."
					: "Entre para consultar as métricas do trilbit."}
			</p>
			{weakEnvironmentPassword && (
				<p role="status">
					A senha definida no ambiente precisa ter pelo menos 16 caracteres.
					Você também pode configurar o acesso pelo formulário abaixo.
				</p>
			)}
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
				<p className={styles.error} role="alert">
					O aplicativo não conseguiu consultar a configuração de acesso. Confira
					a conexão com o banco e tente novamente.
				</p>
			)}
		</main>
	);
}
