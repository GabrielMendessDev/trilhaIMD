import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardLayout, Icon } from "~/app/_components/dashboard";
import {
	activityFormats,
	type StageModel,
	stageModes,
} from "../../_etapa/model";
import { StageScreen } from "../../_etapa/screen";
import styles from "../../_etapa/stage.module.css";
import { stagesByTrail } from "../../_etapa/stages";
import trailStyles from "../../trail.module.css";
import { stageChallenge, trailMapHref, trails } from "../../trails";

function modelHref(
	base: string,
	mode: StageModel["mode"],
	kind: (typeof activityFormats)[number]["empty"]["kind"],
) {
	const query = new URLSearchParams();
	if (mode !== "conteudo") query.set("modelo", mode);
	if (kind !== activityFormats[0].empty.kind) query.set("tipo", kind);
	return query.size ? `${base}?${query}` : base;
}

export default async function StagePage({
	params,
	searchParams,
}: {
	params: Promise<{ modulo: string; etapa: string }>;
	searchParams: Promise<{
		modelo?: string | string[];
		tipo?: string | string[];
	}>;
}) {
	const { modulo, etapa } = await params;
	const trail = trails.find(({ id }) => id === modulo);
	const number = Number(etapa);
	if (
		!trail ||
		String(number) !== etapa ||
		trail.positions[number - 1] === undefined
	) {
		notFound();
	}

	const { modelo, tipo } = await searchParams;
	const mode = stageModes.find(({ id }) => id === modelo)?.id ?? "conteudo";
	const format =
		activityFormats.find(({ empty }) => empty.kind === tipo) ??
		activityFormats[0];
	const previewContent = { blocks: [] };
	const preview: StageModel =
		mode === "conteudo"
			? { mode, content: previewContent }
			: mode === "atividade"
				? { mode, activity: format.empty }
				: { mode, content: previewContent, activity: format.empty };
	const published = stagesByTrail[trail.id]?.[number];
	const base = `/aprender/${trail.id}/${number}`;
	const title = stageChallenge(number) ?? `Etapa ${number}`;

	return (
		<DashboardLayout active="/aprender">
			<div
				className={`${styles.page} ${trailStyles.trailTheme}`}
				data-trail={trail.id}
			>
				<Link className={styles.back} href={trailMapHref(trail.id, number)}>
					<Icon className="size-4 rotate-90" name="chevron" />
					Voltar ao mapa
				</Link>
				<header className={styles.stageHeader}>
					<div>
						<h1>{title}</h1>
						<p>
							{trail.name}
							{trail.id === "fmc" && " (FMC 1)"}
						</p>
					</div>
					<span aria-hidden="true" className={styles.stageNumber}>
						{number}
					</span>
				</header>

				{!published && (
					<div className={styles.preview}>
						<div className={styles.previewIntro}>
							<h2>Prévia dos modelos</h2>
							<p>Confira os formatos disponíveis para montar esta etapa.</p>
						</div>
						<nav aria-label="Modelo da etapa" className={styles.modeNav}>
							{stageModes.map(({ id, label }) => (
								<Link
									aria-current={mode === id ? "page" : undefined}
									href={modelHref(base, id, format.empty.kind)}
									key={id}
									scroll={false}
								>
									{label}
								</Link>
							))}
						</nav>
						{mode !== "conteudo" && (
							<nav aria-label="Tipo de atividade" className={styles.formatNav}>
								{activityFormats.map(({ empty, label }) => (
									<Link
										aria-current={
											format.empty.kind === empty.kind ? "page" : undefined
										}
										href={modelHref(base, mode, empty.kind)}
										key={empty.kind}
										scroll={false}
									>
										{label}
									</Link>
								))}
							</nav>
						)}
					</div>
				)}

				<StageScreen model={published ?? preview} />
			</div>
		</DashboardLayout>
	);
}
