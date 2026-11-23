import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { analyticsPreference } from "~/domain/analytics";
import { analyticsEnabled } from "~/server/analytics";
import { AnalyticsPreference } from "./preference";

export const metadata: Metadata = { title: "Privacidade e métricas" };

export default async function PrivacyPage() {
	const allowed = (await cookies()).get(analyticsPreference)?.value !== "off";
	const browserOptOut = (await headers()).get("sec-gpc") === "1";
	return (
		<main className="mx-auto max-w-2xl space-y-5 p-6 sm:p-10">
			<Link className="ui-link" href="/">
				Voltar ao início
			</Link>
			<h1 className="font-extrabold text-3xl">Privacidade e métricas</h1>
			<p>
				O trilbit usa métricas para identificar questões difíceis, entender onde
				as sessões terminam e melhorar a experiência de estudo.
			</p>
			<p>
				A medição registra categorias de telas, tempo estimado, consultas a
				explicações, tipo de dispositivo e faixa de largura do navegador. Um
				código temporário no navegador agrupa as visitas da sessão. Esse código
				é separado da conta Google. O painel mostra dados agregados.
			</p>
			<p>
				Comparamos respostas corrigidas a partir dos registros de aprendizagem
				existentes. A opção abaixo pausa novas medições de navegação e de tempo
				neste navegador. O progresso, as respostas e os itens continuam sendo
				registrados para o funcionamento do trilbit.
			</p>
			<p>
				A limpeza automática remove sessões com mais de 32 dias e contadores com
				mais de 90 dias quando há atividade no serviço. A medição também
				respeita o sinal Global Privacy Control (GPC).
			</p>
			{analyticsEnabled() && !browserOptOut ? (
				<AnalyticsPreference initial={allowed} />
			) : (
				<p>A medição está pausada neste navegador.</p>
			)}
		</main>
	);
}
