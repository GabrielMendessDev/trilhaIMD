"use client";

import { useState } from "react";
import { ActionButton } from "~/app/_components/action-button";
import { ProgressBar } from "~/app/_components/progress-bar";
import { ContentBlocks } from "./content";
import type { WalkthroughStep } from "./model";
import styles from "./stage.module.css";

export function Walkthrough({
	steps,
	response,
}: {
	steps: readonly WalkthroughStep[];
	response?: boolean;
}) {
	const [index, setIndex] = useState(0);
	const step = steps[index];
	if (!step) return null;

	return (
		<div className={styles.walkthrough}>
			<p aria-live="polite" className={styles.progressLabel}>
				Passo {index + 1} de {steps.length} · {step.title}
			</p>
			<ProgressBar
				label="Passos do roteiro"
				value={((index + 1) / steps.length) * 100}
			/>
			<ContentBlocks blocks={step.blocks} key={step.id} />
			{response && index === steps.length - 1 && (
				<input name="resposta" type="hidden" value="concluido" />
			)}
			<div className={styles.stepActions}>
				<ActionButton
					disabled={index === 0}
					onClick={() => setIndex(index - 1)}
					type="button"
				>
					Anterior
				</ActionButton>
				<ActionButton
					disabled={index === steps.length - 1}
					onClick={() => setIndex(index + 1)}
					type="button"
				>
					Próximo passo
				</ActionButton>
			</div>
		</div>
	);
}
