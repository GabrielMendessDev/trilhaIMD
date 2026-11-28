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
		</div>
	);
}
