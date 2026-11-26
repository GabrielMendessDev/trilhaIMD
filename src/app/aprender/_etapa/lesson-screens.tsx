import type { ComponentProps, ReactNode } from "react";
import Link from "~/app/_components/action-link";
import { BitoReaction } from "~/app/_components/bito-reaction";
import { Icon } from "~/app/_components/icon";
import { ProgressBar } from "~/app/_components/progress-bar";
import { AnswerResult } from "./answer-result";
import { MultipleChoice } from "./controls";
import { LessonForm } from "./lesson-form";
import { LessonLives } from "./lesson-lives";
import { AnswerMotion, LessonTransition } from "./lesson-motion";
import { LessonRestart } from "./lesson-restart";
import { LessonSession } from "./lesson-session";
import type { LessonCursor, LessonScreen, RestoredAnswer } from "./lesson-view";
import styles from "./pedagogy.module.css";
import { QuestionHelp } from "./question-help";
import { StageScreen } from "./screen";
export function RestoredLessonAnswer({
	feedback,
	screen,
	cursor,
	base,
	walkthrough,
	advance,
}: {
	feedback: RestoredAnswer;
	screen: LessonScreen;
	cursor: LessonCursor;
	base: string;
	walkthrough?: ReactNode;
	advance: ComponentProps<typeof LessonForm>["onAdvance"];
}) {
	const { assessment, effects } = feedback;
	const model = effects?.model ?? screen.model;
	const next =
		cursor.kind === "step"
			? `${base}?${new URLSearchParams({ item: cursor.key })}`
			: base;
	return (
		<AnswerMotion
			className="answer-experience mt-4 space-y-4"
			correct={assessment.correct}
			eventId={assessment.eventId}
		>
			<ProgressBar
				label={
					assessment.round === 2 ? "Andamento da revisão" : "Andamento da lição"
				}
				value={assessment.progress}
			/>
			<LessonLives
				lives={assessment.lives ?? 5}
				review={assessment.round === 2}
			/>
			<section className="ui-panel learning-panel space-y-4 p-5">
				<h2>{screen.title}</h2>
				{"activity" in model && model.activity.prompt && (
					<p>{model.activity.prompt}</p>
				)}
				{"activity" in model && model.activity.kind === "multipla-escolha" ? (
					<MultipleChoice
						choices={model.activity.choices.filter(
							({ id }) => !effects?.removed.includes(id),
						)}
						locked
						selected={assessment.selection[0]}
					/>
				) : (
					<ul aria-label="Sua resposta" className={styles.answerList}>
						{assessment.chosen.map(({ id, label, value }) => (
							<li key={id}>
								{label && <strong>{label} · </strong>}
								{value}
							</li>
						))}
					</ul>
				)}
			</section>
			<QuestionHelp example={effects?.example} hint={effects?.hint} />
			<AnswerResult
				assessment={assessment}
				destination={next}
				example={walkthrough}
				onContinue={() => advance(cursor, next)}
			/>
		</AnswerMotion>
	);
}
export function LostLesson({
	cursor,
	advance,
	mapHref,
	pointId,
}: {
	cursor: Extract<LessonCursor, { kind: "lost" }>;
	advance: ComponentProps<typeof LessonForm>["onAdvance"];
	mapHref: string;
	pointId: number;
}) {
	return (
		<LessonTransition screenKey={`lost-${cursor.run}`}>
			<section
				aria-labelledby="lesson-lost"
				className="ui-panel learning-panel space-y-4 p-5"
			>
				<LessonLives lives={0} />
				<h2 id="lesson-lost">Atividade perdida</h2>
				<p>
					As 5 vidas acabaram nesta rodada. Esta atividade não foi concluída e a
					próxima etapa continua bloqueada.
				</p>
				<p>
					Você pode consultar os materiais e recomeçar do início com 5 vidas.
					Seus erros anteriores ficam registrados. As outras etapas e o saldo da
					conta continuam salvos.
				</p>
				<LessonRestart onRestart={advance} pointId={pointId} run={cursor.run} />
				<Link className="ui-link" href={mapHref}>
					Voltar ao mapa
				</Link>
			</section>
		</LessonTransition>
	);
}
export function LessonStep({
	screen,
	screens,
	index,
	cursor,
	editable,
	usesSessions,
	mapHref,
	active,
	pointId,
	endpoint,
	walkthrough,
	inventory,
	advance,
	rememberLessonUrl,
	setInventory,
	onUseItem,
	browse,
	signedIn,
}: {
	screen: LessonScreen;
	screens: LessonScreen[];
	index: number;
	cursor?: LessonCursor;
	editable?: Extract<LessonCursor, { kind: "step" }>;
	usesSessions: boolean;
	mapHref: string;
	active: boolean;
	pointId: number;
	endpoint: string;
	walkthrough?: ReactNode;
	inventory: Record<string, number>;
	advance: ComponentProps<typeof LessonForm>["onAdvance"];
	rememberLessonUrl: ComponentProps<typeof LessonForm>["onFeedback"];
	setInventory: ComponentProps<typeof LessonForm>["onInventory"];
	onUseItem: ComponentProps<typeof LessonForm>["onUseItem"];
	browse: (key?: string) => void;
	signedIn: boolean;
}) {
	const round = editable?.round ?? 1;
	const starting = index === 0 && editable?.starting;
	const graded = screens.filter((entry) => entry.graded);
	const step = (
		<LessonTransition
			key={`${screen.key}-${round}`}
			kind={round === 2 ? "review" : screen.graded ? "question" : "explanation"}
			screenKey={`${screen.key}-${round}`}
		>
			<section aria-label="Lição" className="mt-4 space-y-4">
				{editable?.round === 2 && (
					<div className={styles.reviewIntro}>
						<Icon name="sparkle" />
						<div>
							<h2>Hora de revisar!</h2>
							<p>
								Volte às questões que ficaram pendentes. Você tem mais uma
								tentativa em cada uma. Os erros da revisão não tiram vidas.
							</p>
						</div>
					</div>
				)}
				<div className={starting ? styles.lessonStart : undefined}>
					{starting && <BitoReaction mood="acenando" />}
					<div className="min-w-0 flex-1 space-y-2">
						<p className="ui-muted font-semibold text-sm">
							{editable?.round === 2
								? `Revisão ${editable.reviewPosition} de ${editable.reviewTotal}`
								: screen.graded
									? `Questão ${graded.indexOf(screen) + 1} de ${graded.length} · Tela ${index + 1} de ${screens.length}`
									: `Material de estudo · Tela ${index + 1} de ${screens.length}`}
						</p>
						{!editable && (
							<ProgressBar
								label="Andamento da lição"
								value={cursor?.kind === "finished" ? 100 : 0}
							/>
						)}
					</div>
				</div>
				{editable ? (
					<LessonForm
						active={active}
						cursor={editable}
						endpoint={endpoint}
						example={walkthrough}
						inventory={inventory}
						key={`${screen.key}-${round}-run-${editable.run}`}
						onAdvance={advance}
						onFeedback={rememberLessonUrl}
						onInventory={setInventory}
						onUseItem={onUseItem}
						pointId={pointId}
						screen={screen}
					/>
				) : (
					<>
						<StageScreen model={screen.model} />
						{cursor?.kind === "finished" && (
							<button
								className="ui-button"
								onClick={() => browse(screens[index + 1]?.key)}
								type="button"
							>
								{screens[index + 1] ? "Próximo item" : "Voltar ao resultado"}
							</button>
						)}
						{!signedIn && (
							<Link className="ui-button" href="/login">
								Entrar para registrar progresso
							</Link>
						)}
						{signedIn && !cursor && (
							<p className="ui-muted text-sm">
								O progresso está indisponível no momento.
							</p>
						)}
					</>
				)}
			</section>
		</LessonTransition>
	);
	return usesSessions &&
		editable &&
		round === 1 &&
		index > 0 &&
		index % 6 === 0 ? (
		<LessonSession
			key={`${screen.key}-run-${editable.run}`}
			number={Math.floor(index / 6) + 1}
			pauseHref={mapHref}
			total={Math.ceil(screens.length / 6)}
		>
			{step}
		</LessonSession>
	) : (
		step
	);
}
