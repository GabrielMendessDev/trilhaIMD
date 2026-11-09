import {
	Association,
	MultipleChoice,
	PairLinks,
	Walkthrough,
} from "./controls";
import { type Activity, activityFormats } from "./model";
import styles from "./stage.module.css";

function ActivitySlots({ kind }: { kind: Activity["kind"] }) {
	switch (kind) {
		case "multipla-escolha":
			return (
				<ul className={styles.slots}>
					{[1, 2, 3].map((number) => (
						<li className={styles.choiceSlot} key={number}>
							<span aria-hidden="true" className={styles.radioMark} />
							Alternativa {number}
						</li>
					))}
				</ul>
			);
		case "associacao":
			return (
				<ul className={styles.slots}>
					{[1, 2].map((number) => (
						<li className={styles.associationRow} key={number}>
							<span>Item {number}</span>
							<span className={styles.slot}>Opção associada</span>
						</li>
					))}
				</ul>
			);
		case "ligacao":
			return (
				<div className={styles.pairGrid}>
					{["Origem", "Destino"].map((column) => (
						<div className={styles.slots} key={column}>
							<strong>{column}</strong>
							<div className={styles.slot}>Item 1</div>
							<div className={styles.slot}>Item 2</div>
						</div>
					))}
				</div>
			);
		case "passo-a-passo":
			return (
				<ol className={styles.sequenceSlots}>
					{[1, 2, 3].map((number) => (
						<li key={number}>
							<span aria-hidden="true">{number}</span>
							Passo {number}
						</li>
					))}
				</ol>
			);
	}
}

function renderControls(activity: Activity) {
	switch (activity.kind) {
		case "multipla-escolha":
			return (
				activity.choices.length > 0 && (
					<MultipleChoice choices={activity.choices} />
				)
			);
		case "associacao":
			return (
				activity.items.length > 0 &&
				activity.options.length > 0 && (
					<Association items={activity.items} options={activity.options} />
				)
			);
		case "ligacao":
			return (
				activity.sources.length > 0 &&
				activity.targets.length > 0 && (
					<PairLinks sources={activity.sources} targets={activity.targets} />
				)
			);
		case "passo-a-passo":
			return (
				activity.steps.length > 0 && <Walkthrough steps={activity.steps} />
			);
	}
}

export function ActivityPanel({ activity }: { activity: Activity }) {
	const format = activityFormats.find(
		({ empty }) => empty.kind === activity.kind,
	);
	const controls = renderControls(activity);

	return (
		<section aria-labelledby="stage-activity" className={styles.panel}>
			<h2 id="stage-activity">{activity.title || format?.label}</h2>
			{activity.prompt && <p className={styles.prompt}>{activity.prompt}</p>}
			{controls || (
				<>
					<p className={styles.panelHint}>{format?.description}</p>
					<div className={styles.promptSlot}>Espaço para o enunciado</div>
					<ActivitySlots kind={activity.kind} />
				</>
			)}
		</section>
	);
}
