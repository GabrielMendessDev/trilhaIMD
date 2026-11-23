import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import Link from "~/app/_components/action-link";
import { Icon, TrilbitLogo } from "~/app/_components/dashboard";
import { FeedbackViewport } from "~/app/_components/feedback";
import { ThemeToggle } from "~/app/_components/theme-toggle";
import { auth, signIn } from "~/server/auth";
import { isGoogleConfigured } from "~/server/auth/config";
import { localLoginEnabled } from "~/server/local-login";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = {
	title: "Entrar",
};

async function enterWithGoogle() {
	"use server";

	if (!isGoogleConfigured) redirect("/login");

	try {
		await signIn("google", { redirectTo: "/aprender" });
	} catch (error) {
		if (error instanceof AuthError) redirect("/login?error=OAuthSignin");
		throw error;
	}
}

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string | string[] }>;
}) {
	if ((await auth())?.user) redirect("/aprender");

	const { error } = await searchParams;

	return (
		<div className="entry-world">
			<header className="entry-top">
				<TrilbitLogo />
				<ThemeToggle />
			</header>
			<FeedbackViewport />

			<main className="entry-main">
				<div className="entry-experience">
					<section aria-labelledby="login-title" className="entry-form">
						<h1
							className="text-balance font-black text-3xl tracking-tight sm:text-4xl"
							id="login-title"
						>
							Sua jornada começa aqui
						</h1>
						<p className="ui-muted mt-3 font-semibold leading-relaxed">
							Entre ou crie sua conta com o Google. O próximo passo da sua
							jornada fica salvo aqui.
						</p>

						{localLoginEnabled() && (
							<form action="/api/dev-login" className="mt-4" method="post">
								<button className="ui-button" type="submit">
									Entrar como estudante de teste
								</button>
							</form>
						)}
						<form action={enterWithGoogle} className="mt-8">
							<GoogleButton disabled={!isGoogleConfigured} />
						</form>

						{!isGoogleConfigured ? (
							<p className="ui-muted mt-3 text-sm">
								O login com Google ainda precisa ser configurado neste ambiente.
							</p>
						) : error ? (
							<p
								className="mt-3 rounded-xl bg-[var(--error-wash)] p-3 font-semibold text-[var(--error-ink)] text-sm"
								role="alert"
							>
								{error === "OAuthAccountNotLinked"
									? "Este e-mail já está vinculado a outra conta."
									: "Não foi possível entrar com o Google. Tente novamente."}
							</p>
						) : null}

						<Link
							className="ui-link mt-4 inline-flex min-h-11 items-center gap-2 self-start text-sm"
							href="/aprender"
						>
							Explorar sem entrar <Icon className="size-4" name="arrow" />
						</Link>
					</section>

					<aside className="entry-story">
						<div aria-hidden="true" className="entry-route">
							<span />
							<span />
							<span />
							<span />
						</div>
						<Image
							alt=""
							className="mx-auto mb-3 h-auto w-full max-w-xs"
							height={600}
							src="/brand/bito.webp"
							unoptimized
							width={900}
						/>
						<h2 className="text-balance font-extrabold text-2xl">
							Aprenda TI.{" "}
							<span className="text-[var(--solar)]">Evolua por trilhas.</span>
						</h2>
						<p className="mt-2 max-w-sm text-[var(--on-night-muted)] text-sm leading-relaxed">
							Feito por estudantes do BTI para quem estuda no IMD.
						</p>
					</aside>
				</div>
			</main>
		</div>
	);
}
