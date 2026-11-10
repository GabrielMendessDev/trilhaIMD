"use client";

import { type CSSProperties, useState } from "react";
import { ActionButton } from "~/app/_components/action-button";
import Link from "~/app/_components/action-link";
import { Icon } from "~/app/_components/icon";
import styles from "./trail.module.css";
import { stageChallenge, type trails } from "./trails";

type Trail = (typeof trails)[number];

function checkpointY(index: number) {
	return 5 + 10 * index;
}

function drawRoute(
	{ connection, positions }: Trail,
	start = 0,
	end = positions.length - 1,
) {
	return positions.slice(start, end + 1).reduce<string>((path, x, offset) => {
		const index = start + offset;
		const y = checkpointY(index);
		if (offset === 0) return `M ${x} ${y}`;

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
	publishedStages,
	previewStages,
	completedStages,
	currentStage,
	sequential,
}: {
	trail: Trail;
	initialStage: number;
	publishedStages: readonly { number: number; title: string | null }[];
	previewStages: readonly number[];
	completedStages: readonly number[];
	currentStage?: number;
	sequential: boolean;
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
				{completedStages
					.filter((number) => number < trail.positions.length)
					.map((number) => (
						<path
							className={styles.completedConnection}
							d={drawRoute(trail, number - 1, number)}
							key={number}
							vectorEffect="non-scaling-stroke"
						/>
					))}
			</svg>
			<ol aria-label={`Etapas de ${trail.name}`} className={styles.checkpoints}>
				{trail.positions.map((position, index) => {
					const number = index + 1;
					const challenge = stageChallenge(number);
					const active = selected === number;
					const published = publishedStages.find(
						(point) => point.number === number,
					);
					const label = published?.title || challenge || `Etapa ${number}`;
					const done = completedStages.includes(number);
					const locked =
						sequential && published && !done && currentStage !== number;
					const state = done
						? "completed"
						: locked
							? "locked"
							: currentStage === number
								? "current"
								: published || previewStages.includes(number)
									? "published"
									: "preview";
					const stateLabel = {
						completed: "Concluída",
						locked: "Bloqueada",
						current: "Próxima etapa",
						published: "Disponível",
						preview: "Prévia de estudo",
					}[state];

					return (
						<li
							className={styles.checkpoint}
							data-side={position >= 50 ? "left" : "right"}
							id={`etapa-${number}`}
							key={number}
							style={{ "--position": `${position}%` } as CSSProperties}
						>
							<ActionButton
								aria-label={`Etapa ${number}${label === `Etapa ${number}` ? "" : ` · ${label}`} · ${stateLabel}`}
								aria-pressed={active}
								className={styles.checkpointButton}
								data-challenge={Boolean(challenge)}
								data-state={state}
								onClick={() => setSelected(number)}
								type="button"
							>
								{(challenge || state !== "preview") && (
									<Icon
										className={styles.checkpointIcon}
										name={
											done
												? "check"
												: locked
													? "lock"
													: challenge
														? "star"
														: "book"
										}
									/>
								)}
								<span className={styles.checkpointNumber}>{number}</span>
							</ActionButton>
							{(active || challenge) && (
								<div className={styles.checkpointLabel} data-active={active}>
									<strong>{label}</strong>
									{active && (
										<>
											<span className={styles.checkpointHint}>
												{stateLabel}
											</span>
											{locked ? (
												<span className={styles.lockedHint}>
													Conclua a etapa {currentStage}.
												</span>
											) : (
												<Link href={`/aprender/${trail.id}/${number}`}>
													{done
														? "Revisitar"
														: published || previewStages.includes(number)
															? "Abrir etapa"
															: "Ver modelos"}
													<Icon className="size-3.5 shrink-0" name="arrow" />
												</Link>
											)}
										</>
									)}
								</div>
							)}
						</li>
					);
				})}
			</ol>
			<p aria-live="polite" className="sr-only">
				Etapa {selected} selecionada.
			</p>
		</div>
	);
}
