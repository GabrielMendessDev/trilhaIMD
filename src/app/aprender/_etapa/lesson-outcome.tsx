import Image from "next/image";
import Link from "~/app/_components/action-link";
import { Icon } from "~/app/_components/icon";
import { ProgressBar } from "~/app/_components/progress-bar";
import {
	CompletionEffects,
	RewardValue,
} from "~/app/_components/reward-effects";
import type { LessonCursor } from "./lesson-view";
import styles from "./pedagogy.module.css";

export function LessonCompletion({
	result,
	title,
	mapHref,
	upcoming,
	exam,
	onRead,
}: {
	result: Extract<LessonCursor, { kind: "finished" }>;
	title: string;
	mapHref: string;
	upcoming?: number;
	exam: boolean;
	onRead?: () => void;
}) {
	const { score } = result;
	const percent = score.total
		? Math.round((score.points / score.total) * 100)
		: 0;
	return (
		<CompletionEffects
			awards={result.awards}
			eventId={result.eventId}
			reward={result.xp}
			unlocked={upcoming}
		>
			<section
				aria-labelledby="lesson-result"
				className={`${styles.result} lesson-completion`}
			>
				<div className={styles.resultHeader}>
					<div>
						<h2 id="lesson-result">
							<span className="completion-medallion">
								<span aria-hidden="true" className="completion-ring" />
								<Icon className="completion-medal" name="trophy" />
							</span>
							Etapa concluída!
						</h2>
						<p>
							{title} · {score.total} questões
						</p>
					</div>
					<Image
						alt=""
						height={600}
						loading="eager"
						src="/brand/bito.webp"
						unoptimized
						width={900}
					/>
				</div>
				<dl className={styles.resultStats}>
					<div>
						<dt>Dominado inicialmente</dt>
						<dd>{score.first}</dd>
					</div>
					<div>
						<dt>Recuperado na revisão</dt>
						<dd>{score.recovered}</dd>
					</div>
					<div>
						<dt>Precisa revisar</dt>
						<dd>{score.missed}</dd>
					</div>
					<div>
						<dt>XP recebido</dt>
						<dd>
							<RewardValue value={result.xp} />
						</dd>
					</div>
					<div>
						<dt>Bits recebidos</dt>
						<dd>
							<span className="completion-bits">+{result.bits}</span>
						</dd>
					</div>
				</dl>
				{result.skipped > 0 && (
					<p>{result.skipped} questões puladas, sem pontuação.</p>
				)}
				{score.legacy > 0 && (
					<p>
						{score.legacy} acertos registrados antes da revisão em duas rodadas.
					</p>
				)}
				{score.total > 0 && (
					<div>
						<p className={styles.scoreLabel}>
							Desempenho <strong>{percent}%</strong>
						</p>
						<ProgressBar label="Desempenho" value={percent} />
						<p className={styles.secondary}>
							Acerto direto vale 1 ponto. Questão recuperada vale 0,5.
						</p>
					</div>
				)}
				{score.topics.length > 0 && (
					<div>
						<h3>Assuntos para rever</h3>
						<ul className={styles.topics}>
							{score.topics.map((topic) => (
								<li key={topic}>{topic}</li>
							))}
						</ul>
					</div>
				)}
				<div className={styles.actions}>
					{exam && (
						<Link className="ui-button" href="/aprender/elementar/prova-1">
							Fazer a Prova 1
						</Link>
					)}
					<Link
						className="ui-button"
						data-learning-direction="back"
						href={mapHref}
					>
						Voltar ao mapa <Icon className="size-4" name="arrow" />
					</Link>
					{onRead && (
						<button
							className="ui-button"
							data-variant="secondary"
							onClick={onRead}
							type="button"
						>
							Reler a lição
						</button>
					)}
				</div>
			</section>
		</CompletionEffects>
	);
}
