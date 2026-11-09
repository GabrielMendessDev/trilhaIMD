import { ActivityPanel } from "./activity";
import { ContentPanel } from "./content";
import type { StageModel } from "./model";
import styles from "./stage.module.css";

export function StageScreen({ model }: { model: StageModel }) {
	return (
		<div className={styles.stageBody}>
			<div className={styles.panels} data-mode={model.mode}>
				{"content" in model && <ContentPanel content={model.content} />}
				{"activity" in model && (
					<ActivityPanel activity={model.activity} key={model.activity.kind} />
				)}
			</div>
		</div>
	);
}
