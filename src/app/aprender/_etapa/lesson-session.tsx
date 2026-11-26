"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "~/app/_components/action-link";

export function LessonSession({
	number,
	total,
	children,
	pauseHref,
}: {
	number: number;
	total: number;
	children: React.ReactNode;
	pauseHref: string;
}) {
	const [mode, setMode] = useState<"arrival" | "paused" | "started">("arrival");
	const heading = useRef<HTMLHeadingElement>(null);
	useLayoutEffect(() => {
		if (mode !== "started") heading.current?.focus({ preventScroll: true });
	}, [mode]);
	if (mode === "started") return children;
	const paused = mode === "paused";
	return (
		<section
			aria-labelledby="session-title"
			className="ui-panel session-arrival my-4 space-y-4 p-6"
		>
			<h2
				className="font-bold text-2xl"
				id="session-title"
				ref={heading}
				tabIndex={-1}
			>
				{paused ? "Sessão pausada" : `Sessão ${number} de ${total}`}
			</h2>
			<p>
				{paused
					? "Seu progresso está salvo. Retome quando quiser."
					: "Você chegou a uma pausa do percurso. As respostas anteriores estão salvas."}
			</p>
			<div className="flex flex-wrap gap-3">
				<button
					className="ui-button"
					onClick={() => setMode("started")}
					type="button"
				>
					{paused ? "Retomar sessão" : "Começar esta sessão"}
				</button>
				{paused ? (
					<Link className="ui-link" href={pauseHref}>
						Voltar ao mapa
					</Link>
				) : (
					<button
						className="ui-link"
						onClick={() => setMode("paused")}
						type="button"
					>
						Fazer uma pausa
					</button>
				)}
			</div>
		</section>
	);
}
