"use client";

import Link, { useLinkStatus } from "next/link";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { useFeedback } from "./feedback";
import { FeedbackIcon } from "./feedback-icon";

function LinkContents({ children }: { children: ReactNode }) {
	const { pending } = useLinkStatus();
	return (
		<>
			{children}
			{pending && (
				<span className="link-pending" role="status">
					<FeedbackIcon kind="loading" />
					<span className="sr-only">Abrindo…</span>
				</span>
			)}
		</>
	);
}

export default function ActionLink({
	children,
	className = "",
	onClick,
	onNavigate,
	...props
}: ComponentProps<typeof Link>) {
	const { startNavigation } = useFeedback();
	const target = useRef("");
	return (
		<Link
			{...props}
			className={`${className} action-link`}
			onClick={(event) => {
				onClick?.(event);
				target.current = event.currentTarget.href;
			}}
			onNavigate={(event) => {
				let cancelled = false;
				onNavigate?.({
					preventDefault: () => {
						cancelled = true;
						event.preventDefault();
					},
				});
				if (!cancelled && !startNavigation(target.current))
					event.preventDefault();
			}}
		>
			<LinkContents>{children}</LinkContents>
		</Link>
	);
}
