"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "~/app/_components/action-button";
import type { ActivityItem } from "./model";
import styles from "./stage.module.css";

export function PairLinks({
	sources,
	targets,
	response,
}: {
	sources: readonly ActivityItem[];
	response?: boolean;
	targets: readonly ActivityItem[];
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const [pairs, setPairs] = useState<ReadonlyMap<string, string>>(
		() => new Map(),
	);
	const linkedSources = new Map(
		Array.from(pairs, ([source, target]) => [target, source]),
	);
	const sourceNumbers = new Map(
		sources.map(({ id }, index) => [id, index + 1]),
	);
	const root = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!response || sources.length === 0 || pairs.size !== sources.length)
			return;
		// Run after the hidden pair inputs have committed to the DOM.
		root.current
			?.closest<HTMLFormElement>('form[data-auto-submit="true"]')
			?.requestSubmit();
	}, [pairs, response, sources.length]);

	function linkTo(target: string) {
		if (selected === null) return;

		setPairs((current) => {
			const next = new Map(current);
			const alreadyLinked = next.get(selected) === target;
			for (const [source, destination] of next) {
				if (destination === target) next.delete(source);
			}
			if (!alreadyLinked) next.set(selected, target);
			return next;
		});
		setSelected(null);
	}

	return (
		<div className={styles.controlGroup} ref={root}>
			<p className={styles.panelHint}>
				Selecione um item em cada coluna. Para desfazer uma ligação, selecione o
				mesmo par novamente.
			</p>
			<div className={styles.pairGrid}>
				<fieldset className={styles.controlGroup}>
					<legend>Origem</legend>
					{sources.map(({ id, label }, index) => (
						<ActionButton
							aria-pressed={selected === id}
							className={styles.pairButton}
							data-pair-source={id}
							key={id}
							onClick={() => setSelected(selected === id ? null : id)}
							type="button"
						>
							{label}
							{pairs.has(id) && (
								<span className={styles.pairBadge}>
									<span className="sr-only">Ligação </span>
									{index + 1}
								</span>
							)}
						</ActionButton>
					))}
				</fieldset>
				<fieldset className={styles.controlGroup}>
					<legend>Destino</legend>
					{targets.map(({ id, label }) => {
						const linked = linkedSources.get(id);
						const number =
							linked === undefined ? 0 : (sourceNumbers.get(linked) ?? 0);

						return (
							<ActionButton
								aria-disabled={selected === null}
								className={styles.pairButton}
								data-pair-target={id}
								disabled={selected === null}
								key={id}
								onClick={() => linkTo(id)}
								type="button"
							>
								{label}
								{number > 0 && (
									<span className={styles.pairBadge}>
										<span className="sr-only">Ligação </span>
										{number}
									</span>
								)}
							</ActionButton>
						);
					})}
				</fieldset>
			</div>
			{response &&
				Array.from(pairs, ([source, target]) => (
					<input
						key={source}
						name={`resposta:${source}`}
						type="hidden"
						value={target}
					/>
				))}
			<p className={styles.panelHint} role="status">
				{selected === null
					? `${pairs.size} ${pairs.size === 1 ? "ligação feita" : "ligações feitas"}.`
					: "Escolha um destino para ligar ao item selecionado."}
			</p>
		</div>
	);
}
