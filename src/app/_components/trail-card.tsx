import Link from "~/app/_components/action-link";
import trailStyles from "~/app/aprender/trail.module.css";
import { trailMapHref, type trails } from "~/app/aprender/trails";
import { ProgressBar } from "./dashboard";
import { Icon } from "./icon";
import styles from "./study.module.css";

export function TrailCard({
	trail,
	total,
	completed,
	stage,
}: {
	trail: (typeof trails)[number];
	total: number;
	completed: number | null;
	stage?: number;
}) {
	const percent =
		completed !== null && total ? Math.round((completed * 100) / total) : null;
	return (
		<Link
			className={`${styles.trailCard} ${trailStyles.trailTheme}`}
			data-trail={trail.id}
			href={trailMapHref(trail.id, stage)}
		>
			<div className={styles.trailIdentity}>
				<span aria-hidden="true" className={styles.symbol}>
					{trail.notation}
				</span>
				<h3>{trail.name}</h3>
				<Icon className="size-5 shrink-0" name="arrow" />
			</div>
			{percent !== null ? (
				<div className={styles.trailProgress}>
					<ProgressBar label={`Progresso em ${trail.name}`} value={percent} />
					<span>{percent}%</span>
				</div>
			) : (
				<p className="ui-muted text-xs">
					{total
						? `${total} ${total === 1 ? "etapa publicada" : "etapas publicadas"}`
						: `${trail.positions.length} pontos no mapa · conteúdo em preparação`}
				</p>
			)}
		</Link>
	);
}
