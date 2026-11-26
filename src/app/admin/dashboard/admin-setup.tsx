import { ActionButton } from "~/app/_components/action-button";
import { completeAdminSetup, leaveAdmin } from "./actions";
import styles from "./styles.module.css";

export function AdminSetup({
	available,
	invalid,
	requiresToken,
}: {
	available: boolean;
	invalid: boolean;
	requiresToken: boolean;
}) {
	return (
		<main className={styles.signIn}>
			<h1>Configure seu acesso ao painel</h1>
			<p>Crie um usuário e uma senha para consultar as métricas.</p>
			{available ? (
				<form action={completeAdminSetup} className={styles.form}>
					<label>
						Usuário
						<input
							autoComplete="username"
							maxLength={128}
							minLength={3}
							name="username"
							required
						/>
					</label>
					<label>
						Nova senha (mínimo de 16 caracteres)
						<input
							autoComplete="new-password"
							maxLength={1024}
							minLength={16}
							name="password"
							required
							type="password"
						/>
					</label>
					<label>
						Confirme a nova senha
						<input
							autoComplete="new-password"
							maxLength={1024}
							minLength={16}
							name="confirmPassword"
							required
							type="password"
						/>
					</label>
					{requiresToken && (
						<label>
							Token de configuração do ambiente
							<input
								autoComplete="off"
								maxLength={1024}
								name="setupToken"
								required
								type="password"
							/>
						</label>
					)}
					{invalid && (
						<p className={styles.error} role="alert">
							Confira o usuário, a confirmação da senha e o token, se
							solicitado.
						</p>
					)}
					<ActionButton
						busyLabel="Salvando…"
						className="ui-button"
						type="submit"
					>
						Salvar e entrar
					</ActionButton>
				</form>
			) : (
				<p className={styles.error} role="alert">
					Defina ADMIN_SETUP_TOKEN no ambiente com um valor aleatório de pelo
					menos 24 caracteres para concluir a configuração.
				</p>
			)}
			<form action={leaveAdmin} className={styles.form}>
				<ActionButton busyLabel="Saindo…" className="ui-link" type="submit">
					Sair
				</ActionButton>
			</form>
		</main>
	);
}
