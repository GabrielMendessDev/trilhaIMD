import type { DailyMissions as DailyMissionState } from "~/server/study-insights";
import Link from "./action-link";
import { Icon } from "./icon";
import { ProgressBar } from "./progress-bar";
export function DailyMissions({
	daily,
	compact = false,
}: {
	daily: DailyMissionState | null;
	compact?: boolean;
}) {
	const goals = [
		{
			id: "lesson",
			title: "Avance na jornada",
			detail: "Conclua uma lição.",
			value: daily?.lessons ?? 0,
			goal: 1,
			icon: "flag",
		},
		{
			id: "answers",
			title: "Um pouco de prática",
			detail: "Responda cinco questões novas.",
			value: daily?.answers ?? 0,
			goal: 5,
			icon: "bolt",
		},
		{
			id: "material",
			title: "Explore uma ideia",
			detail: "Leia e conclua um material complementar.",
			value: daily?.materials ?? 0,
			goal: 1,
			icon: "book",
		},
	] as const;
	return (
		<section className="daily-missions" data-compact={compact || undefined}>
			<header>
				<h2>Missões de hoje</h2>
				{compact && (
					<Link className="ui-link" href="/missoes">
						Ver todas <Icon className="size-4" name="arrow" />
					</Link>
				)}
			</header>
			{!daily ? (
				<p>Entre para acompanhar as pequenas metas do seu dia.</p>
			) : (
				<p>
					{daily.bonus
						? `Bônus diário de ${daily.bonusBits} Bits recebido.`
						: `A primeira lição de hoje rende +${daily.bonusBits} Bits.`}
				</p>
			)}
			<ul>
				{goals.slice(0, compact ? 2 : 3).map((g) => (
					<li data-done={g.value >= g.goal} key={g.id}>
						<Icon
							className="size-5"
							name={g.value >= g.goal ? "check" : g.icon}
						/>
						<div>
							<h3>{g.title}</h3>
							{!compact && <p>{g.detail}</p>}
							<ProgressBar
								label={g.title}
								value={Math.min(100, (g.value / g.goal) * 100)}
							/>
						</div>
						<span>
							{Math.min(g.value, g.goal)}/{g.goal}
						</span>
					</li>
				))}
			</ul>
			{!compact && (
				<p className="mission-note">
					O progresso é registrado durante seus estudos. As metas são renovadas
					a cada dia; o bônus é creditado uma vez, ao concluir a primeira lição.
				</p>
			)}
		</section>
	);
}
