import Image from "next/image";
import type { ReactNode } from "react";
import Link from "~/app/_components/action-link";
import { auth, signOut } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
import { ActionButton } from "./action-button";
import { FeedbackViewport } from "./feedback";
import { Icon } from "./icon";
import { XpBalance } from "./reward-effects";
import styles from "./shell.module.css";
import { SkipLink } from "./skip-link";
import { ThemeToggle } from "./theme-toggle";

export { Icon } from "./icon";
export { ProgressBar } from "./progress-bar";

const nav = [
	["/", "Início", "learn"],
	["/aprender", "Trilhas", "trail"],
	["/disciplinas", "Disciplinas", "layers"],
	["/progresso", "Progresso", "chart"],
	["/conquistas", "Conquistas", "trophy"],
] as const;

export function TrilbitLogo() {
	return (
		<Link className={styles.brand} href="/">
			<Image
				alt=""
				height={34}
				src="/brand/trilbit-mark.svg"
				unoptimized
				width={34}
			/>
			<span>trilbit</span>
		</Link>
	);
}

export async function DashboardLayout({
	children,
	active,
}: {
	children: ReactNode;
	active: string;
}) {
	const user = (await auth())?.user;
	const progress = user ? await getLearningProgress(user.id) : null;
	const name = user?.name || "Minha conta";
	const section = nav.find(([href]) => active === href)?.[1];
	const links = nav.map(([href, label, icon]) => (
		<Link
			aria-current={active === href ? "page" : undefined}
			href={href}
			key={href}
		>
			<Icon className="size-5 shrink-0" name={icon} />
			{label}
		</Link>
	));

	return (
		<div className={styles.shell} data-home={active === "/" || undefined}>
			<SkipLink />
			<aside className={styles.rail}>
				<div className={styles.railBrand}>
					<TrilbitLogo />
				</div>
				<nav aria-label="Navegação principal" className={styles.railNav}>
					{links}
				</nav>
				<div aria-hidden="true" className={styles.railMascot}>
					<Image
						alt=""
						height={600}
						src="/brand/bito.webp"
						unoptimized
						width={900}
					/>
				</div>
			</aside>

			<div className={styles.workspace}>
				<header className={styles.top}>
					<div className={styles.mobileBrand}>
						<TrilbitLogo />
					</div>
					<div className={styles.desktopContext}>
						{section ?? "Minha conta"}
					</div>
					<div className={styles.utilities}>
						{progress && (
							<div className={styles.metrics}>
								<span className={styles.streak}>
									<Icon className="size-4" name="fire" />
									{progress.streak}
									<span aria-hidden="true" className={styles.metricWord}>
										{progress.streak === 1 ? " dia" : " dias"}
									</span>
									<span className="sr-only">
										{progress.streak === 1
											? " dia de ofensiva"
											: " dias de ofensiva"}
									</span>
								</span>
								<XpBalance
									account={user?.id ?? ""}
									className={styles.xp}
									value={progress.xp}
								>
									<Icon className="size-4" name="gem" />
									{progress.xp.toLocaleString("pt-BR")} XP
								</XpBalance>
							</div>
						)}
						{user ? (
							<details className={styles.userMenu}>
								<summary aria-label="Menu da conta" className={styles.avatar}>
									{user.image?.startsWith("https://") ? (
										<Image
											alt=""
											height={40}
											src={user.image}
											unoptimized
											width={40}
										/>
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
							</details>
						) : (
							<>
								<ThemeToggle />
								<Link className={styles.mobileLogin} href="/login">
									Entrar
								</Link>
							</>
						)}
					</div>
				</header>
				<FeedbackViewport />
				<main className={styles.main} id="conteudo-principal" tabIndex={-1}>
					{children}
				</main>
			</div>

			<nav aria-label="Navegação principal" className={styles.mobileNav}>
				{links}
			</nav>
		</div>
	);
}

export function PageHeading({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<header className="ui-heading">
			<h1>{title}</h1>
			<p>{description}</p>
		</header>
	);
}
