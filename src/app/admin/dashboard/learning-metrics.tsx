import type { RankedMetric } from "~/server/admin-metrics";
import {
	DataSection,
	duration,
	format,
	type Metrics,
	percentage,
	Table,
} from "./metrics-table";
import styles from "./styles.module.css";

function ranked(rows: RankedMetric[], descending = false) {
	return [...rows].sort(
		(a, b) =>
			(descending
				? b.correct / b.samples - a.correct / a.samples
				: a.correct / a.samples - b.correct / b.samples) ||
			b.samples - a.samples ||
			a.title.localeCompare(b.title, "pt-BR"),
	);
}

function rankRows(rows: RankedMetric[]) {
	return rows.map((row) => [
		<span key={row.id}>
			{row.title}
			<small>
				{row.trail} · Ponto {row.point}
			</small>
		</span>,
		percentage.format(row.correct / row.samples),
		format.format(row.correct),
		format.format(row.samples),
	]);
}

export function LearningMetrics({ data }: { data: Metrics }) {
	const activities =
		data?.rankings.filter((row) => row.group === "activity") ?? [];
	const points = data?.rankings.filter((row) => row.group === "point") ?? [];
	const accuracyLabels = ["Conteúdo", "Taxa de acerto", "Acertos", "Respostas"];

	return (
		<DataSection
			detail="Taxa de acerto na primeira tentativa registrada. As questões de cada atividade representam o conteúdo avaliado."
			id="aprendizagem"
			title="Desempenho nas trilhas"
		>
			<div className={styles.pair}>
				<div>
					<h3>Atividades e conteúdos mais acertados</h3>
					<Table
						labels={accuracyLabels}
						name="Atividades e conteúdos mais acertados"
						rows={rankRows(ranked(activities, true).slice(0, 8))}
					/>
				</div>
				<div>
					<h3>Atividades e conteúdos menos acertados</h3>
					<Table
						labels={accuracyLabels}
						name="Atividades e conteúdos menos acertados"
						rows={rankRows(ranked(activities).slice(0, 8))}
					/>
				</div>
			</div>
			{data.trails.map((trail) => {
				const trailPoints = points.filter((row) => row.trail === trail);
				const hardest = ranked(
					activities.filter((row) => row.trail === trail),
				)[0];
				return (
					<details
						className={styles.disclosure}
						key={trail}
						open={Boolean(trailPoints.length)}
					>
						<summary>{trail}</summary>
						{hardest && (
							<p>
								Conteúdo com maior dificuldade: <strong>{hardest.title}</strong>{" "}
								· {percentage.format(hardest.correct / hardest.samples)} de
								acerto
							</p>
						)}
						<div className={styles.pair}>
							<div>
								<h3>Pontos de maior dificuldade</h3>
								<Table
									labels={accuracyLabels}
									name={`Pontos de maior dificuldade em ${trail}`}
									rows={rankRows(ranked(trailPoints).slice(0, 5))}
								/>
							</div>
							<div>
								<h3>Pontos de melhor desempenho</h3>
								<Table
									labels={accuracyLabels}
									name={`Pontos de melhor desempenho em ${trail}`}
									rows={rankRows(ranked(trailPoints, true).slice(0, 5))}
								/>
							</div>
						</div>
					</details>
				);
			})}
			<details className={styles.disclosure} open>
				<summary>Tempo médio de resposta por questão</summary>
				<Table
					labels={["Questão", "Tempo médio", "Respostas medidas"]}
					name="Tempo médio por questão"
					rows={data.timings.map((row) => [
						<span key={`${row.activityId}-${row.number}`}>
							{row.activity} · Questão {row.number}
							<small>
								{row.trail} · Ponto {row.point}
								{row.prompt && ` · ${row.prompt}`}
							</small>
						</span>,
						duration(row.averageMs),
						format.format(row.samples),
					])}
				/>
			</details>
		</DataSection>
	);
}
