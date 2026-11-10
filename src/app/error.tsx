"use client";

import { useEffect, useTransition } from "react";
import Link from "~/app/_components/action-link";
import { ActionButton } from "./_components/action-button";
import { FeedbackViewport, useFeedback } from "./_components/feedback";

export default function ErrorPage({ reset }: { reset: () => void }) {
	const { notify, finishNavigation, dismiss } = useFeedback();
	const [pending, transition] = useTransition();
	useEffect(() => {
		finishNavigation();
		notify({
			id: "page-error",
			kind: "error",
			message:
				"Ocorreu uma falha ao abrir a página. Tente novamente ou volte para a área de estudo.",
			duration: 0,
		});
	}, [finishNavigation, notify]);
	return (
		<main className="ui-page">
			<FeedbackViewport />
			<section className="ui-panel max-w-lg p-6">
				<h1 className="font-extrabold text-2xl">
					Não foi possível abrir esta página
				</h1>
				<p className="ui-muted mt-2">
					Tente novamente ou volte para a área de estudo.
				</p>
				<div className="mt-5 flex flex-wrap gap-3">
					<ActionButton
						busy={pending}
						busyLabel="Reabrindo…"
						onClick={() => {
							dismiss("page-error");
							transition(reset);
						}}
						type="button"
					>
						Tentar novamente
					</ActionButton>
					<Link className="ui-button" data-variant="secondary" href="/">
						Voltar ao início
					</Link>
				</div>
			</section>
		</main>
	);
}
