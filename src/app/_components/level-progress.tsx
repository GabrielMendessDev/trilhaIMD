import { items, type levelProgress, rewardsForLevel } from "~/domain/rpg";
import { ProgressBar } from "./progress-bar";

export function LevelBar({
	level,
}: {
	level: ReturnType<typeof levelProgress>;
}) {
	return (
		<ProgressBar
			label={
				level.next === null
					? "Nível máximo atingido"
					: `Progresso até o nível ${level.level + 1}`
			}
			value={level.percent}
		/>
	);
}

export function levelRewardNames(level: number) {
	return rewardsForLevel(level)
		.map((id) => items.find((item) => item.id === id)?.name ?? id)
		.join(", ");
}
