"use client";

import { type ComponentProps, useEffect, useRef } from "react";

/**
 * `<details>` que também fecha ao clicar fora, ao apertar Esc
 * ou ao escolher um link de dentro dele.
 */
export function DismissibleDetails(props: ComponentProps<"details">) {
	const ref = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const details = ref.current;
		if (!details) return;

		const close = () => {
			details.open = false;
		};
		const onPointerDown = (event: PointerEvent) => {
			if (details.open && !details.contains(event.target as Node)) close();
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || !details.open) return;
			close();
			details.querySelector("summary")?.focus();
		};
		const onClick = (event: MouseEvent) => {
			if ((event.target as Element).closest("a")) close();
		};

		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		details.addEventListener("click", onClick);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
			details.removeEventListener("click", onClick);
		};
	}, []);

	return <details ref={ref} {...props} />;
}
