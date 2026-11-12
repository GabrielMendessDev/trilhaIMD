export default function Loading() {
	return (
		<div
			aria-label="Carregando conteúdo"
			className="ui-page learning-skeleton"
			role="status"
		>
			<div aria-hidden="true" className="journey-skeleton-surface">
				<div className="mb-4 h-5 w-2/5 rounded-lg bg-[var(--surface-soft)]" />
				<div className="h-20 rounded-xl bg-[var(--surface-soft)]" />
			</div>
		</div>
	);
}
