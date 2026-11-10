"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { FeedbackIcon } from "./feedback-icon";

export function ActionButton({
	children,
	busy = false,
	busyLabel = "Processando…",
	state,
	className = "ui-button",
	disabled,
	type = "button",
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	busy?: boolean;
	busyLabel?: string;
	state?: "success" | "error";
}) {
	const form = useFormStatus();
	const pending = busy || form.pending;
	return (
		<button
			{...props}
			aria-busy={pending || undefined}
			className={`${className} action-control`}
			data-action-state={pending ? "loading" : state}
			disabled={disabled || pending}
			type={type}
		>
			<span className="action-label" data-hidden={pending || undefined}>
				{children}
				{state && !pending && <FeedbackIcon kind={state} />}
			</span>
			{(type === "submit" || pending) && (
				<span
					aria-hidden={!pending}
					className="action-pending"
					data-hidden={!pending || undefined}
				>
					<FeedbackIcon kind="loading" />
					{busyLabel}
				</span>
			)}
		</button>
	);
}
