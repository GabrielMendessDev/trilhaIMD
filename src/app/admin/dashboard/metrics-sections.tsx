import { LearningMetrics } from "./learning-metrics";
import { duration, format, type Metrics } from "./metrics-table";
import { RetentionMetrics } from "./retention-metrics";
import styles from "./styles.module.css";
import { TrafficMetrics } from "./traffic-metrics";

export function DashboardMetrics({ data }: { data: Metrics }) {
	return (
		<>
			<dl className={styles.summary}>
				<div>
					<dt>Acessos</dt>
					<dd>{format.format(data.summary?.accesses ?? 0)}</dd>
					<small>Sessões iniciadas</small>
				</div>
				<div>
					<dt>Duração média da sessão</dt>
					<dd>
						{data.summary?.durationMs != null &&
						data.summary.sessionsMeasured >= 5
							? duration(data.summary.durationMs)
							: "—"}
					</dd>
					<small>Tempo ativo estimado</small>
				</div>
				<div>
					<dt>Maior ofensiva</dt>
					<dd>
						{data.streak == null
							? "—"
							: `${format.format(data.streak)} ${data.streak === 1 ? "dia" : "dias"}`}
					</dd>
					<small>Recorde histórico</small>
				</div>
			</dl>
			<nav aria-label="Seções de métricas" className={styles.navigation}>
				<a href="#aprendizagem">Aprendizagem</a>
				<a href="#retencao">Retenção e apoio</a>
				<a href="#acessos">Acessos</a>
				<a href="#dispositivos">Dispositivos</a>
			</nav>
			<LearningMetrics data={data} />
			<RetentionMetrics data={data} />
			<TrafficMetrics data={data} />
		</>
	);
}
