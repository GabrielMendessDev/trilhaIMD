import { useId } from "react";
import styles from "./route-loading.module.css";

export function RouteLoading({
	target,
	fallback = false,
}: {
	target: string;
	fallback?: boolean;
}) {
	const [section, trail, stage] =
		target.split("?")[0]?.split("/").slice(1) ?? [];
	const layout =
		section === "login"
			? "login"
			: section === "aprender" && trail && stage
				? "lesson"
				: !section || section === "aprender"
					? "map"
					: ["loja", "mochila", "disciplinas", "conquistas"].includes(section)
						? "catalog"
						: "list";
	const hasRail = layout !== "login" && layout !== "lesson";
	const markId = useId();
	const leftId = `${markId}-left`;
	const rightId = `${markId}-right`;
	const topId = `${markId}-top`;

	return (
		<div
			aria-label="Carregando conteúdo"
			className={styles.loading}
			data-layout={layout}
			data-route-fallback={fallback || undefined}
			data-route-loading=""
			data-shell={hasRail || undefined}
			role="status"
		>
			<div aria-hidden="true" className={styles.skeleton}>
				{hasRail && (
					<div className={styles.rail}>
						{[0, 1, 2, 3, 4, 5].map((item) => (
							<i key={item} />
						))}
					</div>
				)}
				<div className={styles.top}>
					<i />
					<i />
				</div>
				<div className={styles.body}>
					<div className={styles.heading}>
						<i />
						<i />
					</div>
					<div className={styles.content}>
						{[0, 1, 2, 3, 4, 5].map((item) => (
							<div className={styles.panel} key={item}>
								<i />
								<i />
								<i />
							</div>
						))}
					</div>
				</div>
				{hasRail && (
					<div className={styles.bottom}>
						{[0, 1, 2, 3, 4].map((item) => (
							<i key={item} />
						))}
					</div>
				)}
			</div>
			<div className={styles.mark}>
				<svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
					<defs>
						<path
							d="M9 13c0 5 2 8 7 8h2c1 0 2 1 2 2v8c0 5 1 8 4 9"
							id={leftId}
							pathLength="1"
						/>
						<path
							d="M39 9c0 6-2 10-8 10h-1c-2 0-3 1-3 3v10c0 5-1 7-3 8"
							id={rightId}
							pathLength="1"
						/>
						<path d="M9 13c5-1 10-1 15-2l15-2" id={topId} pathLength="1" />
					</defs>
					<g stroke="#8C6DFF" strokeLinecap="round" strokeWidth="5.5">
						<use href={`#${leftId}`} />
						<use href={`#${rightId}`} />
						<use href={`#${topId}`} />
					</g>
					<g
						className={styles.pulses}
						stroke="#fff"
						strokeLinecap="round"
						strokeWidth="2.2"
					>
						<use href={`#${leftId}`} />
						<use href={`#${rightId}`} />
						<use href={`#${topId}`} />
					</g>
					<circle cx="9" cy="13" fill="#6558F5" r="8" />
					<circle cx="39" cy="9" fill="#FFAA6B" r="8" />
					<circle cx="24" cy="39" fill="#25C5AB" r="8" />
					<circle cx="9" cy="13" fill="#fff" r="3.5" />
					<circle cx="39" cy="9" fill="#fff" r="3.5" />
					<circle cx="24" cy="39" fill="#fff" r="3.5" />
				</svg>
			</div>
		</div>
	);
}
