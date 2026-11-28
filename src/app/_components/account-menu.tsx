import Image from "next/image";
import { signOut } from "~/server/auth";
import { ActionButton } from "./action-button";
import Link from "./action-link";
import { DismissibleDetails } from "./dismissible-details";
import { Icon } from "./icon";
import styles from "./shell.module.css";

export function AccountMenu({
	image,
	name,
}: {
	image?: string | null;
	name: string;
}) {
	return (
		<DismissibleDetails className={`${styles.userMenu} profile-menu`}>
			<summary aria-label="Menu da conta" className={styles.avatar}>
				{image?.startsWith("https://") ? (
					<Image alt="" height={40} src={image} unoptimized width={40} />
				) : (
					<Icon className="size-6" name="profile" />
				)}
			</summary>
			<div className={styles.userDropdown}>
				<strong className="block px-2 pb-2 text-sm [overflow-wrap:anywhere]">
					{name}
				</strong>
				<Link className="ui-link block p-2 text-sm" href="/perfil">
					Perfil e configurações
				</Link>
				<Link className="ui-link block p-2 text-sm" href="/mochila">
					Minha Mochila
				</Link>
				<Link className="ui-link block p-2 text-sm" href="/loja">
					Loja do Bito
				</Link>
				<Link className="ui-link block p-2 text-sm" href="/ranking">
					Ranking · em preparação
				</Link>
				<form
					action={async () => {
						"use server";
						await signOut({ redirectTo: "/login" });
					}}
				>
					<ActionButton
						busyLabel="Saindo…"
						className="ui-link p-2 text-sm"
						type="submit"
					>
						Sair da conta
					</ActionButton>
				</form>
			</div>
		</DismissibleDetails>
	);
}
