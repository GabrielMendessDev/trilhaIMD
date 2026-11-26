import { type Screen, screens } from "~/domain/analytics";
import {
	DataSection,
	format,
	type Metrics,
	percentage,
	Table,
} from "./metrics-table";
import styles from "./styles.module.css";

const weekday = [
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado",
	"Domingo",
];

export function TrafficMetrics({ data }: { data: Metrics }) {
	const peak = (kind: "hour" | "day") =>
		(data?.peaks ?? [])
			.filter((row) => row.kind === kind)
			.sort((a, b) => b.count - a.count || Number(a.label) - Number(b.label))
			.map(({ label, count }) => [
				kind === "hour"
					? `${label.padStart(2, "0")}h`
					: weekday[Number(label) - 1],
				format.format(count),
			]);
	const device = (kind: "device" | "viewport") =>
		(data?.deviceGroups ?? [])
			.filter((row) => row.kind === kind)
			.sort(
				(a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"),
			)
			.map(({ label, count }) => [label, format.format(count)]);
	const abandonment = (data?.daily ?? [])
		.filter((row) => row.kind === "screen")
		.map(({ label, count }) => ({
			label,
			count,
			exits: data?.exits.find((row) => row.label === label)?.count ?? 0,
		}))
		.sort((a, b) => b.exits / b.count - a.exits / a.count || b.count - a.count)
		.map(({ label, count, exits }) => [
			screens[label as Screen],
			percentage.format(exits / count),
			format.format(count),
		]);

	return (
		<>
			{" "}
			<DataSection
				detail="Uma nova sessão começa após 30 minutos sem interação. O tempo ativo considera a aba visível e até 1 minuto após a última interação."
				id="acessos"
				title="Acessos e abandono"
			>
				<div className={styles.pair}>
					<div>
						<h3>Horários de pico</h3>
						<Table
							labels={["Hora", "Acessos"]}
							name="Horários de pico"
							rows={peak("hour")}
						/>
					</div>
					<div>
						<h3>Dias de pico</h3>
						<Table
							labels={["Dia da semana", "Acessos"]}
							name="Dias de pico"
							rows={peak("day")}
						/>
					</div>
				</div>
				<h3>Taxa de abandono por tela</h3>
				<p>
					Proporção de visitas em que a tela foi a última antes da inatividade
					da sessão.
				</p>
				<Table
					labels={["Tela", "Taxa de saída", "Visitas à tela"]}
					name="Taxa de abandono por tela"
					rows={abandonment}
				/>
			</DataSection>
			<DataSection
				detail="Classificação estimada do dispositivo e largura da área visível do navegador na entrada."
				id="dispositivos"
				title="Dispositivos e tamanho de tela"
			>
				<div className={styles.pair}>
					<div>
						<h3>Tipo de dispositivo</h3>
						<Table
							labels={["Dispositivo", "Sessões"]}
							name="Tipos de dispositivo"
							rows={device("device")}
						/>
					</div>
					<div>
						<h3>Largura da tela</h3>
						<Table
							labels={["Faixa", "Sessões"]}
							name="Larguras da tela"
							rows={device("viewport")}
						/>
					</div>
				</div>
			</DataSection>
		</>
	);
}
