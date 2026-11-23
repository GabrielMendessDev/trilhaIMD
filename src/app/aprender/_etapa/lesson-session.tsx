"use client";
import { useState } from "react";
import Link from "~/app/_components/action-link";

export function LessonSession({
	number,
	total,
	children,
}: {
	number: number;
	total: number;
	children: React.ReactNode;
}) {
	const [started, setStarted] = useState(false);
	if (started) return children;
	return (
		<section
			aria-labelledby="session-title"
			className="ui-panel session-arrival my-4 space-y-4 p-6"
		>
			<h2 className="font-bold text-2xl" id="session-title">
				Sessão {number} de {total}
			</h2>
			<p>
				Você chegou a uma pausa do percurso. As respostas anteriores estão
				salvas. Continue com a próxima sessão ou retome pelo mapa quando quiser.
			</p>
			<div className="flex flex-wrap gap-3">
				<button
					className="ui-button"
					onClick={() => setStarted(true)}
					type="button"
				>
					Começar esta sessão
				</button>
				<Link className="ui-link" href="/aprender">
					Fazer uma pausa
				</Link>
			</div>
		</section>
	);
}
