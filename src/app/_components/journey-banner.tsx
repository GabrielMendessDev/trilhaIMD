import type { trails } from "~/app/aprender/trails";
import Link from "./action-link";
import { Icon } from "./icon";
import { ProgressBar } from "./progress-bar";
import { TrailSymbol } from "./trail-symbol";
export function JourneyBanner({
	trail,
	completed,
	total,
	next,
	href,
}: {
	trail: (typeof trails)[number];
	completed: number;
	total: number;
	next?: { number: number; title: string | null };
	href?: string;
}) {
	return (
		<header className="journey-banner" data-trail={trail.id}>
			<div className="journey-banner-title">
				<span className="journey-emblem">
					<TrailSymbol id={trail.id} />
				</span>
				<div>
					<h2>{trail.name}</h2>
					<p>
						{total
							? `${trail.id === "elementar" ? "Percurso de 60 passos" : "Unidade 1"} · ${completed} de ${total} lições concluídas`
							: "Jornada em preparação · explore os materiais disponíveis"}
					</p>
				</div>
			</div>
			<div className="journey-banner-progress">
				<ProgressBar
					label={`Progresso em ${trail.name}`}
					value={total ? (completed / total) * 100 : 0}
				/>
				<span>{total ? Math.round((completed / total) * 100) : 0}%</span>
			</div>
			{next && href && (
				<div className="journey-next">
					<p>
						<span>Próxima lição</span>
						<strong>{next.title ?? `Etapa ${next.number}`}</strong>
					</p>
					<Link className="ui-button" href={href}>
						Continuar <Icon className="size-4" name="arrow" />
					</Link>
				</div>
			)}
		</header>
	);
}
