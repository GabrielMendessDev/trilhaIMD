import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Icon, TrilhaLogo } from "~/app/_components/dashboard";
import { auth, signIn } from "~/server/auth";
import { isGoogleConfigured } from "~/server/auth/config";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = {
	title: "Entrar | Trilha IMD",
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
		<div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 sm:px-8">
			<header className="flex justify-center py-7 md:justify-start">
				<TrilhaLogo />
			</header>

			<main className="grid flex-1 items-center pb-12 md:pb-24">
				<div className="mx-auto grid w-full max-w-md overflow-hidden rounded-2xl border-2 border-slate-100 bg-white md:max-w-none md:grid-cols-2">
					<section
						aria-labelledby="login-title"
						className="flex flex-col justify-center px-6 py-10 sm:p-10 lg:p-14"
					>
						<h1
							className="text-balance font-black text-3xl tracking-tight sm:text-4xl"
							id="login-title"
						>
							Entre na sua trilha
						</h1>
						<p className="mt-3 font-semibold text-slate-600 leading-relaxed">
							Use sua conta Google para acessar a Trilha IMD.
						</p>

						<form action={enterWithGoogle} className="mt-8">
							<GoogleButton disabled={!isGoogleConfigured} />
						</form>

						{!isGoogleConfigured ? (
							<p className="mt-3 text-slate-600 text-sm">
								O login com Google ainda precisa ser configurado neste ambiente.
							</p>
						) : error ? (
							<p
								className="mt-3 rounded-xl bg-rose-50 p-3 font-semibold text-rose-800 text-sm"
								role="alert"
							>
								{error === "OAuthAccountNotLinked"
									? "Este e-mail já está vinculado a outra conta."
									: "Não foi possível entrar com o Google. Tente novamente."}
							</p>
						) : null}

						<Link
							className="mt-6 self-start font-extrabold text-sm text-violet-700 underline-offset-4 hover:underline"
							href="/aprender"
						>
							Explorar sem entrar <span aria-hidden="true">→</span>
						</Link>
					</section>

					<aside className="hidden flex-col justify-center bg-violet-600 p-10 text-white md:flex lg:p-14">
						<div
							aria-hidden="true"
							className="relative mb-8 flex max-w-64 items-center justify-between gap-4 before:absolute before:inset-x-4 before:top-1/2 before:h-1 before:bg-violet-300/50"
						>
							<span className="relative grid size-12 place-items-center rounded-xl bg-white text-violet-700 shadow-[0_4px_0_#4c36be]">
								<Icon className="size-6" name="learn" />
							</span>
							<span className="relative grid size-12 place-items-center rounded-xl bg-violet-800 text-violet-100 shadow-[0_4px_0_#4c36be]">
								<Icon className="size-6" name="practice" />
							</span>
							<span className="relative grid size-12 place-items-center rounded-xl bg-violet-800 text-violet-100 shadow-[0_4px_0_#4c36be]">
								<Icon className="size-6" name="ranking" />
							</span>
						</div>
						<h2 className="text-balance font-black text-3xl tracking-tight">
							Aprenda no seu ritmo
						</h2>
						<p className="mt-3 max-w-xs font-semibold text-violet-50 leading-relaxed">
							Avance pelas lições do IMD, pratique o que aprendeu e complete
							missões ao longo do caminho.
						</p>
					</aside>
				</div>
			</main>
		</div>
	);
}
