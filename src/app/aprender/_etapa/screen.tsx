import { ActivityPanel } from "./activity";
import { ContentPanel } from "./content";
import type { StageModel } from "./model";
import styles from "./stage.module.css";

export function StageScreen({
	model,
	response = false,
}: {
	model: StageModel;
	response?: boolean;
}) {
	return (
		<div className={styles.stageBody}>
			<div className={styles.panels} data-mode={model.mode}>
				{"content" in model &&
					(model.mode === "mista" ? (
						<details className="lesson-contextual-reading">
							<summary>Relembrar o conceito</summary>
							<ContentPanel content={model.content} />
						</details>
					) : (
						<ContentPanel content={model.content} />
					))}
				{"activity" in model && (
					<ActivityPanel
						activity={model.activity}
						key={model.activity.kind}
						response={response}
					/>
				)}
			</div>
		</div>
	);
}
