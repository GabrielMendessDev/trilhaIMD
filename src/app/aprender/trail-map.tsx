"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";
import styles from "./trail.module.css";
import { stageChallenge, type trails } from "./trails";

type Trail = (typeof trails)[number];

function checkpointY(index: number) {
	return 5 + 10 * index;
}

function drawRoute({ connection, positions }: Trail) {
	return positions.reduce<string>((path, x, index) => {
		const y = checkpointY(index);
		if (index === 0) return `M ${x} ${y}`;

		switch (connection) {
			case "curve":
				return `${path} C ${positions[index - 1]} ${y - 6}, ${x} ${y - 4}, ${x} ${y}`;
			case "circuit":
				return `${path} V ${y - 5} H ${x} V ${y}`;
			default:
				return `${path} L ${x} ${y}`;
		}
	}, "");
}

export function TrailMap({
	trail,
	initialStage,
}: {
	trail: Trail;
	initialStage: number;
}) {
	const [selected, setSelected] = useState(initialStage);

	return (
		<div className={styles.route}>
			<svg
				aria-hidden="true"
				className={styles.routeLines}
				preserveAspectRatio="none"
				viewBox="0 0 100 100"
			>
				{trail.connection === "branch" && (
					<path
						className={styles.branches}
						d="M48 15 L20 25 M69 35 L85 45 M28 55 L14 65 M47 75 L21 85"
						vectorEffect="non-scaling-stroke"
					/>
				)}
				<path
					className={styles.connection}
					d={drawRoute(trail)}
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			<ol aria-label={`Etapas de ${trail.name}`} className={styles.checkpoints}>
				{trail.positions.map((position, index) => {
					const number = index + 1;
					const challenge = stageChallenge(number);
					const active = selected === number;
					const label = challenge || `Etapa ${number}`;

					return (
						<li
							className={styles.checkpoint}
							data-side={position >= 50 ? "left" : "right"}
							id={`etapa-${number}`}
							key={number}
							style={{ "--position": `${position}%` } as CSSProperties}
						>
							<button
								aria-label={challenge ? `Etapa ${number}, ${challenge}` : label}
								aria-pressed={active}
								className={styles.checkpointButton}
								data-challenge={Boolean(challenge)}
								onClick={() => setSelected(number)}
								type="button"
							>
								{challenge && (
									<svg
										aria-hidden="true"
										fill="none"
										height="14"
										stroke="currentColor"
										strokeLinejoin="round"
										strokeWidth="1.75"
										viewBox="0 0 24 24"
										width="14"
									>
										<path d="m12 2 2.9 6.2 6.8.8-5 4.8 1.3 6.7-6-3.3-6 3.3 1.3-6.7-5-4.8 6.8-.8z" />
									</svg>
								)}
								{number}
							</button>
							{(active || challenge) && (
								<div className={styles.checkpointLabel}>
									<strong>{label}</strong>
									{active && (
										<Link href={`/aprender/${trail.id}/${number}`}>
											Ver modelos <span aria-hidden="true">→</span>
										</Link>
									)}
								</div>
							)}
						</li>
					);
				})}
			</ol>
			<p aria-live="polite" className="sr-only">
				Etapa {selected} selecionada. Modelos disponíveis para visualização.
			</p>
		</div>
	);
}
