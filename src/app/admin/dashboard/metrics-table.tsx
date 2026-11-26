import { isValidElement, type ReactNode } from "react";
import type { readAdminMetrics } from "~/server/admin-metrics";
import styles from "./styles.module.css";

export type Metrics = Awaited<ReturnType<typeof readAdminMetrics>>;
export const format = new Intl.NumberFormat("pt-BR");
export const percentage = new Intl.NumberFormat("pt-BR", {
	style: "percent",
	maximumFractionDigits: 1,
});
export function duration(ms: number) {
	const seconds = ms / 1000;
	return seconds < 60
		? `${seconds.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`
		: `${Math.floor(seconds / 60)} min ${Math.floor(seconds % 60)} s`;
}

function Empty() {
	return <p className={styles.empty}>Ainda não há amostra suficiente.</p>;
}

export function Table({
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

export function DataSection({
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
