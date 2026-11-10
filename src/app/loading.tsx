export default function Loading() {
	return (
		<div className="ui-page" role="status">
			<p className="ui-muted mb-4 text-sm">Carregando a área de estudo…</p>
			<div aria-hidden="true" className="ui-panel p-6">
				<div className="mb-4 h-5 w-2/5 rounded-lg bg-[var(--surface-soft)]" />
				<div className="h-20 rounded-xl bg-[var(--surface-soft)]" />
			</div>
		</div>
	);
}
