import type { Metadata } from "next";
import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import { ActionButton } from "~/app/_components/action-button";
import {
	fatigueBands,
	recallBands,
	type Screen,
	screens,
} from "~/domain/analytics";
import { adminConfigured, isAdmin } from "~/server/admin-auth";
import { type RankedMetric, readAdminMetrics } from "~/server/admin-metrics";
import { pruneAnalytics } from "~/server/analytics";
import { enterAdmin, leaveAdmin } from "./actions";
import styles from "./styles.module.css";

export const metadata: Metadata = {
	title: "Painel administrativo",
	robots: { index: false, follow: false },
};

const format = new Intl.NumberFormat("pt-BR");
const percentage = new Intl.NumberFormat("pt-BR", {
	style: "percent",
	maximumFractionDigits: 1,
});
const weekday = [
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado",
	"Domingo",
];

function duration(ms: number) {
	const seconds = ms / 1000;
	return seconds < 60
		? `${seconds.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`
		: `${Math.floor(seconds / 60)} min ${Math.floor(seconds % 60)} s`;
}

function date(day: string) {
	return day.split("-").reverse().join("/");
}

function Empty() {
	return <p className={styles.empty}>Ainda não há amostra suficiente.</p>;
}

function Table({
	labels,
	rows,
	name,
}: {
	labels: string[];
	rows: ReactNode[][];
	name: string;
}) {
	if (!rows.length) return <Empty />;
	return (
		<div className={styles.tableScroll}>
			<table aria-label={name}>
				<thead>
					<tr>
						{labels.map((label) => (
							<th key={label} scope="col">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map(([title, ...values]) => (
						<tr key={isValidElement(title) ? title.key : String(title)}>
							<th scope="row">{title}</th>
							{values.map((value, column) => (
								<td key={labels[column + 1]}>{value}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function DataSection({
	id,
	title,
	detail,
	children,
}: {
	id: string;
	title: string;
	detail?: string;
	children: ReactNode;
}) {
	return (
		<section aria-labelledby={id} className={styles.section}>
			<h2 id={id}>{title}</h2>
			{detail && <p>{detail}</p>}
			{children}
		</section>
	);
}

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

export default async function AdminDashboard({
	searchParams,
}: {
	searchParams: Promise<{ erro?: string }>;
}) {
	if (!(await isAdmin())) {
		const configured = adminConfigured();
		const invalid = (await searchParams).erro === "1";
		return (
			<main className={styles.signIn}>
				<Link className="ui-link" href="/">
					trilbit
				</Link>
				<h1>Painel administrativo</h1>
				<p>Entre para consultar as métricas do trilbit.</p>
				{configured ? (
					<form action={enterAdmin} className={styles.form}>
						<label>
							Usuário
							<input
								autoComplete="username"
								maxLength={256}
								name="username"
								required
							/>
						</label>
						<label>
							Senha
							<input
								autoComplete="current-password"
								maxLength={1024}
								name="password"
								required
								type="password"
							/>
						</label>
						{invalid && (
							<p className={styles.error} role="alert">
								Usuário ou senha incorretos.
							</p>
						)}
						<ActionButton
							busyLabel="Entrando…"
							className="ui-button"
							type="submit"
						>
							Entrar
						</ActionButton>
					</form>
				) : (
					<p role="alert">
						Configure a senha administrativa no ambiente para liberar o painel.
					</p>
				)}
			</main>
		);
	}

	const data = await readAdminMetrics().catch((error: unknown) => {
		console.error(
			"Painel de métricas indisponível.",
			error instanceof Error ? error.message : "",
		);
		return null;
	});
	await pruneAnalytics().catch(() =>
		console.error("Limpeza das métricas indisponível."),
	);
	const activities =
		data?.rankings.filter((row) => row.group === "activity") ?? [];
	const points = data?.rankings.filter((row) => row.group === "point") ?? [];
	const accuracyLabels = ["Conteúdo", "Taxa de acerto", "Acertos", "Respostas"];
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
		<main className={styles.dashboard}>
			<header className={styles.header}>
				<div>
					<h1>Métricas do trilbit</h1>
					{data && (
						<p>
							{date(data.firstDay)} a {date(data.today)} · Horário de Brasília
						</p>
					)}
				</div>
				<form action={leaveAdmin}>
					<ActionButton
						busyLabel="Saindo…"
						className="ui-button"
						data-variant="secondary"
						type="submit"
					>
						Sair do painel
					</ActionButton>
				</form>
			</header>
			{!data ? (
				<p className={styles.error} role="alert">
					Não foi possível consultar as métricas. Confira a conexão com o banco
					e a migração do painel.
				</p>
			) : (
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
											Conteúdo com maior dificuldade:{" "}
											<strong>{hardest.title}</strong> ·{" "}
											{percentage.format(hardest.correct / hardest.samples)} de
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
					<DataSection id="retencao" title="Retenção e apoio">
						<div className={styles.pair}>
							<div>
								<h3>Curva de esquecimento</h3>
								<p>
									Taxa de acerto ao rever, numa atividade reiniciada, uma
									questão acertada anteriormente sem auxílio.
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
									Taxa de acerto por tempo ativo acumulado. A variação pode
									refletir diferenças entre as questões.
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
							Proporção de visitas em que a tela foi a última antes da
							inatividade da sessão.
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
			)}
		</main>
	);
}
