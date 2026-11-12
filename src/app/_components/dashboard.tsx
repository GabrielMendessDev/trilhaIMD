import Image from "next/image";
import type { ReactNode } from "react";
import Link from "~/app/_components/action-link";
import { auth, signOut } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
import { rpgBalance } from "~/server/rpg";
import { ActionButton } from "./action-button";
import { FeedbackViewport } from "./feedback";
import { Icon } from "./icon";
import { RpgAwardNotice, RpgBalances } from "./rpg-balances";
import styles from "./shell.module.css";
import { SidebarMotion } from "./sidebar-motion";
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
		<Link className={`${styles.brand} trilbit-brand`} href="/">
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
	lesson,
}: {
	children: ReactNode;
	active: string;
	lesson?: { backHref: string; unit: string };
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
		<div
			className={styles.shell}
			data-arcane={
				progress?.rpg.inventory.some(
					(i) => i.id === "arcane-frame" && i.equipped,
				) || undefined
			}
			data-experience="journey"
			data-focus-lesson={Boolean(lesson) || undefined}
			data-home={active === "/" || undefined}
			data-stellar={
				progress?.rpg.inventory.some(
					(i) => i.id === "stellar-path" && i.equipped,
				) || undefined
			}
		>
			<SkipLink />
			<aside className={`${styles.rail} app-rail`}>
				<div className={styles.railBrand}>
					<TrilbitLogo />
				</div>
				<SidebarMotion active={active} className={styles.railNav}>
					{links}
				</SidebarMotion>
				<div aria-hidden="true" className={styles.railMascot}>
					<Image
						alt=""
						className="bito-rest"
						height={600}
						src="/brand/bito.webp"
						unoptimized
						width={900}
					/>
				</div>
			</aside>

			<div className={`${styles.workspace} app-workspace`}>
				<header className={`${styles.top} app-top`}>
					{lesson && (
						<Link
							aria-label="Voltar ao mapa"
							className="lesson-exit"
							href={lesson.backHref}
						>
							<Icon className="size-5 rotate-90" name="chevron" />
							<span>Voltar ao mapa</span>
						</Link>
					)}
					<div className={styles.mobileBrand}>
						<TrilbitLogo />
					</div>
					<div className={`${styles.desktopContext} app-top-context`}>
						{lesson?.unit ??
							section ??
							(active === "/loja"
								? "Loja do Bito"
								: active === "/mochila"
									? "Mochila"
									: active === "/missoes"
										? "Missões de hoje"
										: active === "/ranking"
											? "Ranking"
											: "Minha conta")}
					</div>
					<div className={styles.utilities}>
						{progress && <RpgBalances initial={rpgBalance(progress.rpg)} />}
						{user ? (
							<details className={`${styles.userMenu} profile-menu`}>
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
				<main
					className={`${styles.main} app-main`}
					id="conteudo-principal"
					tabIndex={-1}
				>
					{user && <RpgAwardNotice account={user.id} />}
					{progress?.rpg.inventory.some(
						(i) => i.id === "bito-companion" && i.equipped,
					) &&
						!lesson && (
							<div className="rpg-companion" role="status">
								<Image
									alt=""
									height={80}
									src="/brand/bito.webp"
									unoptimized
									width={120}
								/>
								<span>Bito acompanha sua jornada</span>
							</div>
						)}
					{children}
				</main>
			</div>

			<nav
				aria-label="Navegação principal"
				className={`${styles.mobileNav} app-bottom-nav`}
			>
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
		<header className="ui-heading page-heading">
			<h1>{title}</h1>
			<p>{description}</p>
		</header>
	);
}
