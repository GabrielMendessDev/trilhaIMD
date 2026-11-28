"use client";

import { useSyncExternalStore } from "react";
import { ActionButton } from "./action-button";
import { useFeedback } from "./feedback";

const eventName = "trilbit-theme-change";

function subscribe(onChange: () => void) {
	window.addEventListener(eventName, onChange);
	return () => window.removeEventListener(eventName, onChange);
}

function isDark() {
	return document.documentElement.dataset.theme === "dark";
}

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
	const { notify } = useFeedback();
	const dark = useSyncExternalStore(subscribe, isDark, () => false);
	const label = dark ? "Ativar tema claro" : "Ativar tema escuro";

	return (
		<ActionButton
			aria-label={label}
			className="ui-button"
			data-variant="secondary"
			onClick={() => {
				const theme = isDark() ? "light" : "dark";
				document.documentElement.dataset.theme = theme;
				document.cookie = `trilbit-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
				window.dispatchEvent(new Event(eventName));
				notify({
					id: "theme",
					kind: "info",
					message:
						theme === "light" ? "Tema claro ativado." : "Tema escuro ativado.",
				});
			}}
			title={label}
			type="button"
		>
			<svg
				aria-hidden="true"
				className="size-4.5"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.8"
				viewBox="0 0 24 24"
			>
				{dark ? (
					<>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19" />
					</>
				) : (
					<path d="M20.9 14.2A8.9 8.9 0 0 1 9.8 3.1 9 9 0 1 0 20.9 14.2Z" />
				)}
			</svg>
			{withLabel && label}
		</ActionButton>
	);
}
