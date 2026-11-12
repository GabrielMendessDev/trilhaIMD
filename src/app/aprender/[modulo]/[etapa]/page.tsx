import { notFound } from "next/navigation";
import Link from "~/app/_components/action-link";
import { DashboardLayout, Icon } from "~/app/_components/dashboard";
import { elementarCurriculum } from "~/domain/elementar-curriculum";
import { getPublishedPoints } from "~/server/learning";
import { ContentPanel } from "../../_etapa/content";
import { PublishedLesson } from "../../_etapa/published-lesson";
import { stagesByTrail } from "../../_etapa/stages";
import trailStyles from "../../trail.module.css";
import { stageChallenge, trailMapHref, trails, trailUnit } from "../../trails";
export default async function StagePage({
	params,
	searchParams,
}: {
	params: Promise<{ modulo: string; etapa: string }>;
	searchParams: Promise<{
		item?: string;
		material?: string;
		retorno?: string;
		rodada?: string;
	}>;
}) {
	const { modulo, etapa } = await params;
	const trail = trails.find((t) => t.id === modulo),
		number = Number(etapa);
	if (!trail || String(number) !== etapa || !trail.positions[number - 1])
		notFound();
	const [query, points] = await Promise.all([
		searchParams,
		getPublishedPoints(),
	]);
	const point = points?.find(
		(p) => p.trail === trail.id && p.number === number,
	);
	const preview = stagesByTrail[trail.id]?.[number];
	const title =
		point?.title ??
		(trail.id === "elementar"
			? elementarCurriculum.passos[number - 1]?.titulo
			: undefined) ??
		stageChallenge(number, trail.id) ??
		`Etapa ${number}`;
	const unit = trailUnit(trail.id, number);
	return (
		<DashboardLayout
			active="/aprender"
			lesson={{
				backHref: trailMapHref(trail.id, number),
				unit: `Unidade ${unit}`,
			}}
		>
			<div
				className={`lesson-workbench ${trailStyles.trailTheme}`}
				data-trail={trail.id}
			>
				<header className="lesson-context">
					<div>
						<p>
							{trail.name} · Unidade {unit}
						</p>
						<h1>{title}</h1>
					</div>
					<span>
						Lição <b>{number}</b>/{trail.positions.length}
					</span>
				</header>
				{point ? (
					<PublishedLesson
						entryKey={query.item}
						feedbackKey={query.retorno}
						feedbackRound={query.rodada === "2" ? 2 : 1}
						materialKey={query.material}
						point={point}
					/>
				) : preview && "content" in preview ? (
					<section className="lesson-exploration">
						<p className="exploration-note">
							<Icon className="size-4" name="book" />
							Leitura de exploração · este material não registra XP ou
							conclusão.
						</p>
						<ContentPanel content={preview.content} />
						<Link className="ui-button" href={trailMapHref(trail.id, number)}>
							Voltar ao mapa
						</Link>
					</section>
				) : (
					<section className="journey-empty">
						<Icon className="size-12" name="lock" />
						<h2>
							{trail.id === "elementar"
								? "Abra o material de estudo"
								: "Uma nova etapa está a caminho"}
						</h2>
						<p>
							{trail.id === "elementar"
								? "Este passo já está disponível no leitor independente, com explicações, exemplo guiado e questões comentadas. O progresso com XP fica disponível após a publicação no catálogo do aplicativo."
								: "O conteúdo desta lição está sendo preparado. Explore o mapa e os materiais disponíveis da disciplina."}
						</p>
						{trail.id === "elementar" && (
							<Link
								className="ui-button"
								href={`/materiais/elementar/index.html#passo-${number}`}
							>
								Estudar este passo
							</Link>
						)}
						<Link className="ui-button" href={trailMapHref(trail.id, number)}>
							Voltar ao mapa
						</Link>
					</section>
				)}
			</div>
		</DashboardLayout>
	);
}
