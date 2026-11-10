"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { consumeFeedbackEvent } from "~/app/_components/feedback-events";

export function LessonTransition({
	children,
	screenKey,
}: {
	children: ReactNode;
	screenKey: string;
}) {
	const root = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!screenKey) return;
		const heading = root.current?.querySelector<HTMLElement>("h2");
		if (heading) {
			heading.tabIndex = -1;
			heading.focus({ preventScroll: true });
		}
	}, [screenKey]);
	return (
		<div className="lesson-transition" key={screenKey} ref={root}>
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
	useEffect(() => {
		if (consumeFeedbackEvent(() => window.sessionStorage, `${eventId}:motion`))
			root.current?.setAttribute("data-animate", "true");
	}, [eventId]);
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
