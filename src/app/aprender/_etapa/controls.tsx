"use client";

import { useId, useState } from "react";
import { ContentBlocks } from "./content";
import type { ActivityItem, WalkthroughStep } from "./model";
import styles from "./stage.module.css";

export function MultipleChoice({
	choices,
}: {
	choices: readonly ActivityItem[];
}) {
	const name = useId();

	return (
		<fieldset className={styles.controlGroup}>
			<legend className="sr-only">Selecione uma alternativa</legend>
			{choices.map(({ id, label }) => (
				<label className={styles.choice} key={id}>
					<input name={name} type="radio" value={id} />
					<span>{label}</span>
				</label>
			))}
		</fieldset>
	);
}

export function Association({
	items,
	options,
}: {
	items: readonly ActivityItem[];
	options: readonly ActivityItem[];
}) {
	return (
		<fieldset className={styles.controlGroup}>
			<legend className="sr-only">Associe cada item a uma opção</legend>
			{items.map(({ id, label }) => (
				<label className={styles.associationRow} key={id}>
					<span>{label}</span>
					<select defaultValue="">
						<option value="">Selecionar opção</option>
						{options.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			))}
		</fieldset>
	);
}

export function PairLinks({
	sources,
	targets,
}: {
	sources: readonly ActivityItem[];
	targets: readonly ActivityItem[];
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const [pairs, setPairs] = useState<ReadonlyMap<string, string>>(
		() => new Map(),
	);
	const linkedSources = new Map(
		Array.from(pairs, ([source, target]) => [target, source]),
	);

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
		<div className={styles.controlGroup}>
			<p className={styles.panelHint}>
				Selecione um item em cada coluna. Para desfazer uma ligação, selecione o
				mesmo par novamente.
			</p>
			<div className={styles.pairGrid}>
				<fieldset className={styles.controlGroup}>
					<legend>Origem</legend>
					{sources.map(({ id, label }, index) => (
						<button
							aria-pressed={selected === id}
							className={styles.pairButton}
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
						</button>
					))}
				</fieldset>
				<fieldset className={styles.controlGroup}>
					<legend>Destino</legend>
					{targets.map(({ id, label }) => {
						const linked = linkedSources.get(id);
						const number =
							sources.findIndex((source) => source.id === linked) + 1;

						return (
							<button
								aria-disabled={selected === null}
								className={styles.pairButton}
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
							</button>
						);
					})}
				</fieldset>
			</div>
			<p className={styles.panelHint} role="status">
				{selected === null
					? `${pairs.size} ${pairs.size === 1 ? "ligação feita" : "ligações feitas"}.`
					: "Escolha um destino para ligar ao item selecionado."}
			</p>
		</div>
	);
}

export function Walkthrough({ steps }: { steps: readonly WalkthroughStep[] }) {
	const [index, setIndex] = useState(0);
	const step = steps[index];
	if (!step) return null;

	return (
		<div className={styles.walkthrough}>
			<p aria-live="polite" className={styles.progressLabel}>
				Passo {index + 1} de {steps.length} · {step.title}
			</p>
			<progress
				aria-label="Passos do roteiro"
				className={styles.progress}
				max={steps.length}
				value={index + 1}
			/>
			<ContentBlocks blocks={step.blocks} key={step.id} />
			<div className={styles.stepActions}>
				<button
					disabled={index === 0}
					onClick={() => setIndex(index - 1)}
					type="button"
				>
					Anterior
				</button>
				<button
					disabled={index === steps.length - 1}
					onClick={() => setIndex(index + 1)}
					type="button"
				>
					Próximo passo
				</button>
			</div>
		</div>
	);
}
