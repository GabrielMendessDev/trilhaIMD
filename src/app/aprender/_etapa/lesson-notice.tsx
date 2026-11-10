"use client";

import { useEffect, useRef, useState } from "react";
import { useFeedback } from "~/app/_components/feedback";
import { consumeFeedbackEvent } from "~/app/_components/feedback-events";
import styles from "./pedagogy.module.css";

export function LessonNotice({
	message,
	durationMs = 2800,
	eventId,
	correct,
}: {
	message: string;
	durationMs?: number;
	eventId: string;
	correct: boolean;
}) {
	const heading = useRef<HTMLHeadingElement>(null);
	const [visible, setVisible] = useState(false);
	const { notify } = useFeedback();
	useEffect(() => {
		heading.current?.focus();
		if (
			consumeFeedbackEvent(() => window.sessionStorage, `${eventId}:notice`)
		) {
			setVisible(true);
			notify({
				id: "answer",
				kind: correct ? "success" : "error",
				message,
				duration: 3500,
			});
		}
		const timeout = window.setTimeout(() => setVisible(false), durationMs);
		return () => window.clearTimeout(timeout);
	}, [durationMs, eventId, correct, message, notify]);
	return (
		<div className={styles.noticeText}>
			<h2 ref={heading} tabIndex={-1}>
				{message}
			</h2>
			<span aria-hidden="true" className={styles.flash} data-visible={visible}>
				Resposta registrada
			</span>
		</div>
	);
}
