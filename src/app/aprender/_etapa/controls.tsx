"use client";

import { useId, useState } from "react";
import { ActionButton } from "~/app/_components/action-button";
import { ProgressBar } from "~/app/_components/progress-bar";
import { ContentBlocks } from "./content";
import type { ActivityItem, WalkthroughStep } from "./model";
import styles from "./stage.module.css";

export function MultipleChoice({
	choices,
	response,
}: {
	choices: readonly ActivityItem[];
	response?: boolean;
}) {
	const name = useId();

	return (
		<fieldset className={styles.controlGroup}>
			<legend className="sr-only">Selecione uma alternativa</legend>
			{choices.map(({ id, label }) => (
				<label className={styles.choice} key={id}>
					<input
						name={response ? "resposta" : name}
						required={response}
						type="radio"
						value={id}
					/>
					<span>{label}</span>
				</label>
			))}
		</fieldset>
	);
}

export function Association({
	items,
	options,
	response,
}: {
	items: readonly ActivityItem[];
	response?: boolean;
	options: readonly ActivityItem[];
}) {
	return (
		<fieldset className={styles.controlGroup}>
			<legend className="sr-only">Associe cada item a uma opção</legend>
			{items.map(({ id, label }) => (
				<label className={styles.associationRow} key={id}>
					<span>{label}</span>
					<select
						defaultValue=""
						name={response ? `resposta:${id}` : undefined}
						required={response}
					>
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
						<ActionButton
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
						</ActionButton>
					))}
				</fieldset>
				<fieldset className={styles.controlGroup}>
					<legend>Destino</legend>
					{targets.map(({ id, label }) => {
						const linked = linkedSources.get(id);
						const number =
							sources.findIndex((source) => source.id === linked) + 1;

						return (
							<ActionButton
								aria-disabled={selected === null}
								className={styles.pairButton}
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
