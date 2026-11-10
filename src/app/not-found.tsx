import Link from "~/app/_components/action-link";

export default function NotFound() {
	return (
		<main className="ui-page">
			<section className="ui-panel max-w-lg p-6">
				<h1 className="font-extrabold text-2xl">Página fora da trilha</h1>
				<p className="ui-muted mt-2">
					Este endereço não está disponível. Volte ao mapa para continuar.
				</p>
				<Link className="ui-button mt-4" href="/aprender">
					Abrir trilhas
				</Link>
			</section>
		</main>
	);
}
