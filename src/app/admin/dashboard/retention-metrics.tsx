import { fatigueBands, recallBands } from "~/domain/analytics";
import {
	DataSection,
	format,
	type Metrics,
	percentage,
	Table,
} from "./metrics-table";
import styles from "./styles.module.css";

export function RetentionMetrics({ data }: { data: Metrics }) {
	const distribution = (kind: string, labels: string[]) =>
		labels.flatMap((label) => {
			const metric = data?.daily.find(
				(row) => row.kind === kind && row.label === label,
			);
			return metric
				? [
						[
							label,
							percentage.format(metric.total / metric.count),
							format.format(metric.count),
						],
					]
				: [];
		});

	return (
		<DataSection id="retencao" title="Retenção e apoio">
			<div className={styles.pair}>
				<div>
					<h3>Curva de esquecimento</h3>
					<p>
						Taxa de acerto ao rever, numa atividade reiniciada, uma questão
						acertada anteriormente sem auxílio.
					</p>
					<Table
						labels={[
							"Intervalo entre tentativas",
							"Taxa de acerto",
							"Respostas",
						]}
						name="Curva de esquecimento"
						rows={distribution("recall", recallBands)}
					/>
				</div>
				<div>
					<h3>Fadiga cognitiva</h3>
					<p>
						Taxa de acerto por tempo ativo acumulado. A variação pode refletir
						diferenças entre as questões.
					</p>
					<Table
						labels={["Tempo de sessão", "Taxa de acerto", "Respostas"]}
						name="Fadiga cognitiva"
						rows={distribution("fatigue", fatigueBands)}
					/>
				</div>
			</div>
			<h3>Uso de dicas e explicações</h3>
			<Table
				labels={["Recurso", "Usos"]}
				name="Uso de dicas e explicações"
				rows={[
					...data.hints,
					...data.daily.filter((row) => row.kind === "support"),
				].map(({ label, count }) => [label, format.format(count)])}
			/>
		</DataSection>
	);
}
