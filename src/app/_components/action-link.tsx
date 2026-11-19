"use client";

import Link, { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { useFeedback } from "./feedback";
import { FeedbackIcon } from "./feedback-icon";
import { navigateLearning } from "./learning-navigation";

function LinkContents({
	children,
	busy,
}: {
	children: ReactNode;
	busy: boolean;
}) {
	const { pending: linkPending } = useLinkStatus();
	const pending = busy || linkPending;
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
	const { startNavigation, navigation } = useFeedback();
	const router = useRouter();
	const target = useRef("");
	const direction = useRef("forward");
	const busy = Boolean(
		navigation &&
			target.current &&
			new URL(target.current).pathname + new URL(target.current).search ===
				navigation.target,
	);
	return (
		<Link
			{...props}
			aria-busy={busy || props["aria-busy"]}
			className={`${className} action-link`}
			onClick={(event) => {
				onClick?.(event);
				target.current = event.currentTarget.href;
				direction.current =
					event.currentTarget.dataset.learningDirection ??
					(event.currentTarget.textContent?.includes("Voltar")
						? "back"
						: "forward");
			}}
			onNavigate={(event) => {
				let cancelled = false;
				onNavigate?.({
					preventDefault: () => {
						cancelled = true;
						event.preventDefault();
					},
				});
				if (cancelled) return;
				if (!startNavigation(target.current)) {
					event.preventDefault();
					return;
				}
				const url = new URL(target.current, window.location.href);
				if (
					url.origin === window.location.origin &&
					`${url.pathname}${url.search}` !==
						`${window.location.pathname}${window.location.search}`
				) {
					event.preventDefault();
					navigateLearning(() => {
						const destination = `${url.pathname}${url.search}${url.hash}`;
						if (props.replace)
							router.replace(destination, { scroll: props.scroll });
						else router.push(destination, { scroll: props.scroll });
					}, direction.current);
				}
			}}
		>
			<LinkContents busy={busy}>{children}</LinkContents>
		</Link>
	);
}
