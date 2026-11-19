"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { motionTiming } from "./motion";

let lastPosition: number | undefined;

export function SidebarMotion({
	children,
	className = "",
	active,
}: {
	children: ReactNode;
	className?: string;
	active: string;
}) {
	const root = useRef<HTMLElement>(null);
	const indicator = useRef<HTMLSpanElement>(null);
	useLayoutEffect(() => {
		const nav = root.current;
		const selected = nav?.querySelector<HTMLElement>(
			`a[href="${CSS.escape(active)}"][aria-current="page"]`,
		);
		const marker = indicator.current;
		if (!nav || !selected || !marker) return;
		const position = selected.offsetTop;
		marker.style.height = `${selected.offsetHeight}px`;
		marker.style.transform = `translateY(${position}px)`;
		let motion: Animation | undefined;
		if (
			lastPosition !== undefined &&
			lastPosition !== position &&
			!window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			motion = marker.animate(
				[
					{ transform: `translateY(${lastPosition}px)` },
					{ transform: `translateY(${position}px)` },
				],
				motionTiming(marker, "enter", "enter"),
			);
		}
		lastPosition = position;
		return () => motion?.cancel();
	}, [active]);
	return (
		<nav
			aria-label="Navegação principal"
			className={`${className} sidebar-motion`}
			ref={root}
		>
			<span
				aria-hidden="true"
				className="sidebar-indicator opacity-0"
				ref={indicator}
			/>
			{children}
		</nav>
	);
}
