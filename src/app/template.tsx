"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import {
	hasNativeNavigation,
	revealPageContent,
} from "./_components/learning-navigation";

export default function PageTransition({ children }: { children: ReactNode }) {
	const root = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (
			!children ||
			hasNativeNavigation() ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		)
			return;
		let cleanup: (() => void) | undefined;
		const reveal = () => {
			const main = root.current?.querySelector("main");
			if (!main) return false;
			cleanup = revealPageContent(main);
			return true;
		};
		if (reveal()) return cleanup;
		const observer = new MutationObserver(() => {
			if (reveal()) observer.disconnect();
		});
		if (root.current)
			observer.observe(root.current, { childList: true, subtree: true });
		return () => {
			observer.disconnect();
			cleanup?.();
		};
	}, [children]);
	return (
		<div className="page-transition" ref={root}>
			{children}
		</div>
	);
}
