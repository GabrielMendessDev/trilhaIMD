"use client";

import { type ReactNode, useEffect, useRef } from "react";
import Link from "~/app/_components/action-link";
import { FeedbackIcon } from "~/app/_components/feedback-icon";
import { Icon } from "~/app/_components/icon";
import type { AnswerAssessment } from "./answer-model";

export function AnswerResult({
	assessment,
	destination,
	example,
}: {
	assessment: AnswerAssessment;
	destination: string;
	example?: ReactNode;
}) {
	const heading = useRef<HTMLHeadingElement>(null);
	const { correct, round, hint, explanation, solution, finished } = assessment;
	useEffect(() => {
		heading.current?.focus({ preventScroll: true });
	}, []);
	const message = assessment.failed
		? "As vidas acabaram"
		: correct
			? round === 1
				? "Mandou bem!"
				: "Você conseguiu na revisão!"
			: round === 1
				? "Ainda não foi dessa vez!"
				: "Vamos entender a resposta";
	return (
		<div className="answer-reveal">
			<section
				aria-label="Resultado da resposta"
				className="answer-result"
				data-result-panel="true"
			>
				<div className="answer-verdict">
					<span className="answer-emblem">
						<FeedbackIcon kind={correct ? "success" : "error"} />
						<span aria-hidden="true" className="answer-ring" />
					</span>
					<div>
						<h2 ref={heading} tabIndex={-1}>
							{message}
						</h2>
						<p className="answer-caption">
							{assessment.failed
								? "Atividade perdida · sem conclusão ou recompensa da etapa"
								: correct
									? round === 1
										? "Resposta correta registrada"
										: "Questão recuperada"
									: round === 1
										? "Uma nova chance no fim da atividade"
										: "Dificuldade registrada para estudar"}
						</p>
					</div>
					{correct && (
						<span aria-hidden="true" className="answer-particles">
							{[0, 1, 2, 3, 4, 5].map((index) => (
								<i key={index} />
							))}
						</span>
					)}
				</div>
				{hint && <p>{hint}</p>}
				{assessment.failed && (
					<p>
						Você perdeu esta atividade. Recomece do início com 5 vidas; suas
						outras etapas continuam salvas.
					</p>
				)}
				{!assessment.failed && !correct && round === 1 && (
					<p className="answer-guidance">
						<FeedbackIcon kind="info" />
						Vamos continuar aprendendo. Esta questão voltará na revisão final.
					</p>
				)}
				{solution.length > 0 && (
					<div className="answer-solution">
						<h3>Resposta correta</h3>
						<ul>
							{solution.map(({ id, label, value }) => (
								<li key={id}>
									{label && <strong>{label} · </strong>}
									{value}
								</li>
							))}
						</ul>
					</div>
				)}
				{explanation && <p>{explanation}</p>}
				{!correct && round === 2 && example && (
					<details className="answer-example">
						<summary>Ver exemplo resolvido da atividade</summary>
						{example}
					</details>
				)}
				<Link
					className="ui-button answer-continue"
					data-learning-direction="forward"
					href={destination}
				>
					{assessment.failed
						? "Ver atividade perdida"
						: finished
							? "Ver meu resultado"
							: "Continuar"}
					<Icon className="size-4" name="arrow" />
				</Link>
			</section>
		</div>
	);
}
