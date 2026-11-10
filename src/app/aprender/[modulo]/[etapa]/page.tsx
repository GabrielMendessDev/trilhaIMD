import { notFound } from "next/navigation";
import Link from "~/app/_components/action-link";
import { DashboardLayout, Icon } from "~/app/_components/dashboard";
import { getPublishedPoints } from "~/server/learning";
import {
	activityFormats,
	type StageModel,
	stageModes,
} from "../../_etapa/model";
import { PublishedLesson } from "../../_etapa/published-lesson";
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
		item?: string | string[];
		material?: string | string[];
		retorno?: string | string[];
		rodada?: string | string[];
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

	const { modelo, tipo, item, material, retorno, rodada } = await searchParams;
	const points = await getPublishedPoints();
	const point = points?.find(
		(point) => point.trail === trail.id && point.number === number,
	);
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
	const title = point?.title ?? stageChallenge(number) ?? `Etapa ${number}`;

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

				{!published && !point && (
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

				{point ? (
					<PublishedLesson
						entryKey={typeof item === "string" ? item : undefined}
						feedbackKey={typeof retorno === "string" ? retorno : undefined}
						feedbackRound={rodada === "2" ? 2 : 1}
						materialKey={typeof material === "string" ? material : undefined}
						point={point}
					/>
				) : (
					<StageScreen model={published ?? preview} />
				)}
			</div>
		</DashboardLayout>
	);
}
