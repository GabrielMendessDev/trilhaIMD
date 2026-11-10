"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const previousValues = new Map<string, number>();

export function ProgressBar({
	value,
	label,
}: {
	value: number;
	label: string;
}) {
	const percent = Math.min(100, Math.max(0, value));
	const pathname = usePathname();
	const bar = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		const key = `${pathname}:${label}`;
		let animation: Animation | undefined;
		const scheduled = window.setTimeout(() => {
			const previous = previousValues.get(key);
			previousValues.set(key, percent);
			if (
				previous === undefined ||
				previous >= percent ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches
			)
				return;
			animation = bar.current?.animate(
				[{ inlineSize: `${previous}%` }, { inlineSize: `${percent}%` }],
				{ duration: 240, easing: "ease-out" },
			);
		}, 0);
		return () => {
			window.clearTimeout(scheduled);
			animation?.cancel();
		};
	}, [percent, pathname, label]);
	return (
		<div className="study-progress">
			<progress
				aria-label={label}
				className="sr-only"
				max={100}
				value={percent}
			/>
			<span
				aria-hidden="true"
				ref={bar}
				style={{ inlineSize: `${percent}%` }}
			/>
		</div>
	);
}
