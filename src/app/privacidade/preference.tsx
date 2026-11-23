"use client";

import { useState } from "react";
import { changeAnalyticsPreference } from "~/app/_components/analytics-client";

export function AnalyticsPreference({ initial }: { initial: boolean }) {
	const [enabled, setEnabled] = useState(initial);
	return (
		<div className="mt-4 space-y-2">
			<button
				className="ui-button"
				onClick={() => {
					changeAnalyticsPreference(!enabled);
					setEnabled(!enabled);
				}}
				type="button"
			>
				{enabled
					? "Pausar medição neste navegador"
					: "Permitir medição neste navegador"}
			</button>
			<p aria-live="polite">
				{enabled
					? "Preferência do navegador: permitir medição."
					: "Preferência do navegador: medição pausada."}
			</p>
		</div>
	);
}
