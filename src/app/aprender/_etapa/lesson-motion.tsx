"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { useFeedback } from "~/app/_components/feedback";
import { consumeFeedbackEvent } from "~/app/_components/feedback-events";

export function LessonTransition({
	children,
	screenKey,
	kind = "question",
}: {
	children: ReactNode;
	screenKey: string;
	kind?: "question" | "explanation" | "review";
}) {
	const root = useRef<HTMLDivElement>(null);
	const { finishNavigation } = useFeedback();
	useLayoutEffect(() => {
		finishNavigation();
		if (!screenKey) return;
		const heading = root.current?.querySelector<HTMLElement>("h2, legend");
		if (heading) {
			heading.tabIndex = -1;
			heading.focus({ preventScroll: true });
		}
	}, [screenKey, finishNavigation]);
	return (
		<div
			className="lesson-transition"
			data-step-kind={kind}
			key={screenKey}
			ref={root}
		>
			{children}
		</div>
	);
}

export function AnswerMotion({
	eventId,
	className,
	correct,
	children,
}: {
	eventId: string;
	className?: string;
	correct: boolean;
	children: ReactNode;
}) {
	const root = useRef<HTMLElement>(null);
	const { finishNavigation } = useFeedback();
	useLayoutEffect(() => {
		finishNavigation();
		if (consumeFeedbackEvent(() => window.sessionStorage, `${eventId}:motion`))
			root.current?.setAttribute("data-animate", "true");
	}, [eventId, finishNavigation]);
	return (
		<section
			aria-label="Feedback da resposta"
			className={className}
			data-outcome={correct ? "success" : "error"}
			ref={root}
		>
			{children}
		</section>
	);
}
