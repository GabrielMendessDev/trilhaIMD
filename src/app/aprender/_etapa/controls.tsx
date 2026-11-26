"use client";

import { useId } from "react";
import { FeedbackIcon } from "~/app/_components/feedback-icon";
import type { ActivityItem } from "./model";
import styles from "./stage.module.css";

export { PairLinks } from "./pair-links";
export { Walkthrough } from "./walkthrough";

export function MultipleChoice({
	choices,
	response,
	selected,
	locked,
}: {
	choices: readonly ActivityItem[];
	response?: boolean;
	selected?: string;
	locked?: boolean;
}) {
	const name = useId();

	return (
		<fieldset
			className={`${styles.controlGroup} learning-options`}
			disabled={locked}
		>
			<legend className="sr-only">Selecione uma alternativa</legend>
			{choices.map(({ id, label }, index) => (
				<label
					className={`${styles.choice} animated-choice`}
					key={id}
					onPointerDown={(event) => {
						const bounds = event.currentTarget.getBoundingClientRect();
						event.currentTarget.style.setProperty(
							"--wave-x",
							`${event.clientX - bounds.left}px`,
						);
						event.currentTarget.style.setProperty(
							"--wave-y",
							`${event.clientY - bounds.top}px`,
						);
					}}
				>
					<input
						defaultChecked={selected === id}
						name={response ? "resposta" : name}
						onClick={(event) => {
							const form = event.currentTarget.form;
							if (response && form?.dataset.questionState === "error")
								form.requestSubmit();
						}}
						required={response}
						type="radio"
						value={id}
					/>
					<span aria-hidden="true" className="choice-letter">
						{String.fromCharCode(65 + index)}
					</span>
					<span className="choice-copy">{label}</span>
					<span aria-hidden="true" className="choice-wave" />
					<span className="choice-mark choice-correct">
						<FeedbackIcon kind="success" />
					</span>
					<span className="choice-mark choice-incorrect">
						<FeedbackIcon kind="error" />
					</span>
					<span className="choice-processing">
						<FeedbackIcon kind="loading" />
					</span>
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
