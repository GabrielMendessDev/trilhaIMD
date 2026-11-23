"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "~/app/_components/action-link";
import { BitoReaction } from "~/app/_components/bito-reaction";
import { FeedbackIcon } from "~/app/_components/feedback-icon";
import { Icon } from "~/app/_components/icon";
import type { AnswerAssessment } from "./answer-model";

function AnswerReaction({
	correct,
	message,
	round,
}: {
	correct: boolean;
	message: string;
	round: 1 | 2;
}) {
	const [finished, setFinished] = useState(false);
	if (finished) return null;

	return createPortal(
		<div
			aria-hidden="true"
			className="answer-reaction"
			data-correct={correct}
			onAnimationEnd={(event) => {
				if (event.target === event.currentTarget) setFinished(true);
			}}
		>
			<div className="answer-reaction-banner">
				<FeedbackIcon kind={correct ? "success" : "error"} />
				<span>{message}</span>
			</div>
			<div className="answer-reaction-bito">
				<BitoReaction
					mood={correct ? "feliz" : round === 2 ? "triste" : "duvida"}
				/>
			</div>
		</div>,
		document.body,
	);
}

export function AnswerResult({
	assessment,
	destination,
	example,
	animate = false,
}: {
	assessment: AnswerAssessment;
	destination: string;
	example?: ReactNode;
	animate?: boolean;
}) {
	const heading = useRef<HTMLHeadingElement>(null);
	const verdict = useRef<HTMLDivElement>(null);
	const { correct, round, hint, explanation, solution, finished } = assessment;
	useEffect(() => {
		heading.current?.focus({ preventScroll: true });
		verdict.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
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
	const resultTitle = assessment.failed
		? "As vidas acabaram"
		: correct
			? round === 2
				? "Questão recuperada"
				: "Resposta correta"
			: round === 2
				? "Resposta incorreta na revisão"
				: "Resposta incorreta";
	const caption = assessment.failed
		? "Atividade perdida · sem conclusão ou recompensa da etapa"
		: correct
			? null
			: round === 1
				? "Uma nova chance no fim da atividade"
				: "Dificuldade registrada para estudar";
	return (
		<div className="answer-reveal">
			{animate && (
				<AnswerReaction
					correct={correct}
					key={assessment.eventId}
					message={message}
					round={round}
				/>
			)}
			<section
				aria-label="Resultado da resposta"
				className="answer-result"
				data-result-panel="true"
			>
				<div className="answer-verdict" ref={verdict}>
					<span className="answer-emblem">
						<FeedbackIcon kind={correct ? "success" : "error"} />
						<span aria-hidden="true" className="answer-ring" />
					</span>
					<div>
						<h2 ref={heading} tabIndex={-1}>
							{resultTitle}
						</h2>
						{caption && <p className="answer-caption">{caption}</p>}
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
