import Image from "next/image";
import Link from "~/app/_components/action-link";
import { BitoReaction } from "~/app/_components/bito-reaction";
import { Icon, ProgressBar } from "~/app/_components/dashboard";
import {
	CompletionEffects,
	RewardValue,
} from "~/app/_components/reward-effects";
import { livesOf } from "~/domain/lesson-lives.mjs";
import { auth } from "~/server/auth";
import type { PublishedPoint } from "~/server/learning";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import {
	feedbackFor,
	getLesson,
	isGraded,
	lessonItems,
	toStageModel,
} from "~/server/lesson";
import {
	type LessonProgress,
	lessonProgressPercent,
	lessonScore,
	pendingItem,
} from "~/server/lesson-progress";
import { getCompletionBits } from "~/server/rpg";
import { getAllQuestionStates } from "~/server/rpg-actions";
import { effectiveEntry } from "~/server/rpg-support";
import { trailMapHref } from "../trails";
import { AnswerResult } from "./answer-result";
import { ContentPanel } from "./content";
import { MultipleChoice, Walkthrough } from "./controls";
import { LessonForm } from "./lesson-form";
import { LessonLives } from "./lesson-lives";
import { AnswerMotion, LessonTransition } from "./lesson-motion";
import { LessonRestart } from "./lesson-restart";
import { LessonSession } from "./lesson-session";
import { MaterialCompletion } from "./material-completion";
import styles from "./pedagogy.module.css";
import { QuestionHelp } from "./question-help";
import { StageScreen } from "./screen";

const emptyProgress: LessonProgress = { completedEntries: [], attempts: {} };
const materialHref = (base: string, key: string) =>
	`${base}?${new URLSearchParams({ material: key })}`;

function Materials({
	base,
	items,
	open = false,
}: {
	base: string;
	items: { key: string; title: string }[];
	open?: boolean;
}) {
	if (items.length === 0) return null;
	return (
		<details className={styles.materials} open={open || undefined}>
			<summary>
				Materiais de estudo <span>{items.length}</span>
			</summary>
			<ul>
				{items.map(({ key, title }) => (
					<li key={key}>
						<Link href={materialHref(base, key)}>{title}</Link>
					</li>
				))}
			</ul>
		</details>
	);
}

export async function PublishedLesson({
	point,
	entryKey,
	feedbackKey,
	feedbackRound,
	materialKey,
}: {
	point: PublishedPoint;
	entryKey?: string;
	feedbackKey?: string;
	feedbackRound: 1 | 2;
	materialKey?: string;
}) {
	const { trail, number, id } = point;
	const base = `/aprender/${trail}/${number}`;
	const [catalog, lesson, student] = await Promise.all([
		getPublishedPoints(),
		getLesson(id),
		auth().then(async (session) => {
			const user = session?.user;
			const [progress, questionStates] = user
				? await Promise.all([
						getLearningProgress(user.id),
						getAllQuestionStates(user.id, id),
					])
				: [null, {} as Awaited<ReturnType<typeof getAllQuestionStates>>];
			return { user, progress, questionStates };
		}),
	]);
	const { user, progress, questionStates } = student;
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		trail,
	);
	const row = progress?.rows.find((item) => item.pointId === id);
	const state = row ?? emptyProgress;
	const items = lessonItems(lesson);
	const models = lesson.map((original) => {
		const entry = effectiveEntry(
			original,
			questionStates[original.key]?.effects ?? {},
		);
		return { entry, model: toStageModel(entry) };
	});
	const materials = models.flatMap(({ entry, model }) =>
		"content" in model && model.content.category === "material"
			? [
					{
						key: entry.key,
						title: model.content.title ?? entry.title,
						content: model.content,
					},
				]
			: [],
	);
	const material = materials.find(({ key }) => key === materialKey);
	const library = <Materials base={base} items={materials} />;

	if (material)
		return (
			<LessonTransition
				key={`material-${material.key}`}
				screenKey={`material-${material.key}`}
			>
				<div className="mt-4 space-y-4">
					<ContentPanel content={material.content} />
					{user && <MaterialCompletion entryKey={material.key} pointId={id} />}
					<Link className="ui-button" href={base}>
						Voltar à lição
					</Link>
					<Materials base={base} items={materials} open />
				</div>
			</LessonTransition>
		);

	if (user && progress && !row?.completedAt && next?.id !== id) {
		return (
			<div className="mt-4 space-y-4">
				<section className="ui-panel p-5">
					<h2 className="font-extrabold text-xl">Etapa bloqueada</h2>
					<p className="ui-muted mt-2">
						Conclua a etapa {next?.number} para avançar no mapa.
					</p>
					<Link
						className="ui-button mt-4"
						href={trailMapHref(trail, next?.number)}
					>
						Voltar ao percurso
					</Link>
				</section>
				{library}
			</div>
		);
	}

	const attempt =
		feedbackKey && row?.attempts[feedbackKey]?.[feedbackRound - 1];
	const feedbackEntry =
		attempt && models.find(({ entry }) => entry.key === feedbackKey)?.entry;
	if (user && row && !row.completedAt && livesOf(row) === 0 && !feedbackEntry)
		return (
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
					Seus erros anteriores ficam registrados; as outras etapas e o saldo da
					conta continuam salvos.
				</p>
				<LessonRestart pointId={id} run={row.run ?? 1} />
				<Link className="ui-link" href={trailMapHref(trail, number)}>
					Voltar ao mapa
				</Link>
				{library}
			</section>
		);
	if (attempt && feedbackEntry && isGraded(feedbackEntry)) {
		const effects = questionStates[feedbackEntry.key]?.effects;
		const result = feedbackFor(feedbackEntry, attempt, feedbackRound);
		const definitiveError = feedbackRound === 2 && !attempt.correct;
		const example =
			definitiveError &&
			models.find(
				({ entry, model }) =>
					entry.key.split("-", 1)[0] === feedbackEntry.key.split("-", 1)[0] &&
					"activity" in model &&
					model.activity.kind === "passo-a-passo",
			)?.model;
		const recordedModel = toStageModel(feedbackEntry);
		return (
			<div className="mt-4 space-y-4">
				<AnswerMotion
					className="answer-experience space-y-4"
					correct={attempt.correct}
					eventId={`answer:${user?.id}:${id}:${feedbackKey}:${feedbackRound}:run-${state.run ?? 1}`}
				>
					<ProgressBar
						label={
							feedbackRound === 2
								? "Andamento da revisão"
								: "Andamento da lição"
						}
						value={lessonProgressPercent(items, state, feedbackRound)}
					/>
					<LessonLives lives={livesOf(state)} review={feedbackRound === 2} />
					<section className="ui-panel learning-panel space-y-4 p-5">
						<h2>{feedbackEntry.title}</h2>
						<p>{feedbackEntry.prompt}</p>
						{"activity" in recordedModel &&
						recordedModel.activity.kind === "multipla-escolha" ? (
							<MultipleChoice
								choices={recordedModel.activity.choices.filter(
									(choice) => !effects?.removed?.includes(choice.id),
								)}
								locked
								selected={attempt.selection[0]}
							/>
						) : (
							<ul aria-label="Sua resposta" className={styles.answerList}>
								{result.chosen.map(({ id, label, value }) => (
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
						assessment={{
							...result,
							correct: attempt.correct,
							round: feedbackRound,
							selection: attempt.selection,
							finished: Boolean(row?.completedAt),
							lives: livesOf(state),
							failed: livesOf(state) === 0,
							progress: 0,
							eventId: `answer:${user?.id}:${id}:${feedbackKey}:${feedbackRound}:run-${state.run ?? 1}`,
						}}
						destination={(() => {
							const next = pendingItem(items, state);
							return next ? `${base}?item=${next.key}` : base;
						})()}
						example={
							example &&
							"activity" in example &&
							example.activity.kind === "passo-a-passo" ? (
								<Walkthrough steps={example.activity.steps} />
							) : undefined
						}
					/>
				</AnswerMotion>
				{library}
			</div>
		);
	}

	if (row?.completedAt && !entryKey) {
		const recorded = new Set(row.completedEntries);
		const score = lessonScore(
			items.filter(({ key }) => recorded.has(key)),
			row,
		);
		const percent = score.total
			? Math.round((score.points / score.total) * 100)
			: 0;
		const upcoming = published.find(
			({ number: step }) =>
				step > number && !completed.some(({ number }) => number === step),
		);
		const completionTime = row.completedAt.getTime();
		const awards =
			progress?.rpg.achievements.filter(
				(a) =>
					a.unlockedAt &&
					Math.abs(new Date(a.unlockedAt).getTime() - completionTime) < 2000,
			) ?? [];
		const completionBits = user ? await getCompletionBits(user.id, id) : 0;
		const completionId = `completion:${user?.id}:${id}:${row.completedAt.toISOString()}`;
		return (
			<div className="mt-4 space-y-4">
				<CompletionEffects
					awards={awards}
					eventId={completionId}
					reward={row.xp}
					unlocked={upcoming?.number}
				>
					<section
						aria-labelledby="lesson-result"
						className={`${styles.result} lesson-completion`}
					>
						<div className={styles.resultHeader}>
							<div>
								<h2 id="lesson-result">
									<span className="completion-medallion">
										<span aria-hidden="true" className="completion-ring" />
										<Icon className="completion-medal" name="trophy" />
									</span>
									Etapa concluída!
								</h2>
								<p>
									{point.title ?? `Ponto ${number}`} · {score.total} questões
								</p>
							</div>
							<Image
								alt=""
								height={600}
								loading="eager"
								src="/brand/bito.webp"
								unoptimized
								width={900}
							/>
						</div>
						<dl className={styles.resultStats}>
							<div>
								<dt>Dominado inicialmente</dt>
								<dd>{score.first}</dd>
							</div>
							<div>
								<dt>Recuperado na revisão</dt>
								<dd>{score.recovered}</dd>
							</div>
							<div>
								<dt>Precisa revisar</dt>
								<dd>{score.missed}</dd>
							</div>
							<div>
								<dt>XP recebido</dt>
								<dd>
									<RewardValue value={row.xp} />
								</dd>
							</div>
							<div>
								<dt>Bits recebidos</dt>
								<dd>
									<span className="completion-bits">+{completionBits}</span>
								</dd>
							</div>
						</dl>
						{(row.skippedEntries?.length ?? 0) > 0 && (
							<p>
								{row.skippedEntries.length} questões puladas, sem pontuação.
							</p>
						)}
						{score.legacy > 0 && (
							<p>
								{score.legacy} acertos registrados antes da revisão em duas
								rodadas.
							</p>
						)}
						{score.total > 0 && (
							<div>
								<p className={styles.scoreLabel}>
									Desempenho <strong>{percent}%</strong>
								</p>
								<ProgressBar label="Desempenho" value={percent} />
								<p className={styles.secondary}>
									Acerto direto vale 1 ponto. Questão recuperada vale 0,5.
								</p>
							</div>
						)}
						{score.topics.length > 0 && (
							<div>
								<h3>Assuntos para rever</h3>
								<ul className={styles.topics}>
									{score.topics.map((topic) => (
										<li key={topic}>{topic}</li>
									))}
								</ul>
							</div>
						)}
						<div className={styles.actions}>
							{trail === "elementar" && number === 20 && (
								<Link className="ui-button" href="/aprender/elementar/prova-1">
									Fazer a Prova 1
								</Link>
							)}
							<Link
								className="ui-button"
								data-learning-direction="back"
								href={trailMapHref(trail, upcoming?.number ?? number)}
							>
								Voltar ao mapa
								<Icon className="size-4" name="arrow" />
							</Link>
							{lesson[0] && (
								<Link
									className="ui-button"
									data-variant="secondary"
									href={`${base}?item=${lesson[0].key}`}
								>
									Reler a lição
								</Link>
							)}
						</div>
					</section>
				</CompletionEffects>
				<Materials base={base} items={materials} open />
			</div>
		);
	}

	const pending = pendingItem(items, state);
	const current =
		models.find(
			({ entry }) => entry.key === (row?.completedAt ? entryKey : pending?.key),
		) ?? models[0];
	if (!current) return null;
	const { entry, model } = current;
	const index = lesson.findIndex((item) => item.key === entry.key);
	const round = pending?.round ?? 1;
	const startingLesson =
		index === 0 &&
		round === 1 &&
		!row?.completedAt &&
		state.completedEntries.length === 0 &&
		Object.keys(state.attempts).length === 0;
	const retryQueue =
		round === 2
			? items.filter(({ key }) => state.attempts[key]?.[0]?.correct === false)
			: [];
	const retryIndex = retryQueue.findIndex(({ key }) => key === entry.key);
	const gradedItems = items.filter(({ graded }) => graded);
	const questionIndex = gradedItems.findIndex(({ key }) => key === entry.key);

	const content = (
		<LessonTransition
			key={`${entry.key}-${round}`}
			kind={
				round === 2 ? "review" : isGraded(entry) ? "question" : "explanation"
			}
			screenKey={`${entry.key}-${round}`}
		>
			<section aria-label="Lição" className="mt-4 space-y-4">
				{round === 2 && (
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
				<div className={startingLesson ? styles.lessonStart : undefined}>
					{startingLesson && <BitoReaction mood="acenando" />}
					<div className="min-w-0 flex-1 space-y-2">
						<p className="ui-muted font-semibold text-sm">
							{round === 2
								? `Revisão ${retryIndex + 1} de ${retryQueue.length}`
								: questionIndex >= 0
									? `Questão ${questionIndex + 1} de ${gradedItems.length} · Tela ${index + 1} de ${lesson.length}`
									: `Material de estudo · Tela ${index + 1} de ${lesson.length}`}
						</p>
						{(!user || !progress || row?.completedAt) && (
							<ProgressBar
								label="Andamento da lição"
								value={
									row?.completedAt
										? 100
										: (state.completedEntries.length / lesson.length) * 100
								}
							/>
						)}
					</div>
				</div>
				{user && progress && !row?.completedAt ? (
					<LessonForm
						autoSubmit={isGraded(entry)}
						bag={{
							pointId: id,
							effects: {
								model,
								variant:
									questionStates[entry.key]?.effects.replacement?.key ?? "",
								hint: questionStates[entry.key]?.effects.hint,
								example: questionStates[entry.key]?.effects.example,
								removed: questionStates[entry.key]?.effects.removed ?? [],
							},
						}}
						endpoint={`${base}/responder`}
						entryKey={entry.key}
						example={(() => {
							const worked = models.find(
								({ entry: candidate, model: sample }) =>
									candidate.key.split("-", 1)[0] ===
										entry.key.split("-", 1)[0] &&
									"activity" in sample &&
									sample.activity.kind === "passo-a-passo",
							)?.model;
							return worked &&
								"activity" in worked &&
								worked.activity.kind === "passo-a-passo" ? (
								<Walkthrough steps={worked.activity.steps} />
							) : undefined;
						})()}
						key={`${entry.key}-${round}-run-${state.run ?? 1}`}
						label="Continuar"
						lives={livesOf(state)}
						progress={
							round === 2
								? (retryIndex / retryQueue.length) * 100
								: (state.completedEntries.length / lesson.length) * 100
						}
						round={round}
						run={state.run ?? 1}
					>
						<StageScreen model={model} response />
					</LessonForm>
				) : (
					<>
						<StageScreen model={model} />
						{row?.completedAt && (
							<Link
								className="ui-button"
								href={
									lesson[index + 1]
										? `${base}?item=${lesson[index + 1]?.key}`
										: base
								}
							>
								{lesson[index + 1] ? "Próximo item" : "Voltar ao resultado"}
							</Link>
						)}
						{!user && (
							<Link className="ui-button" href="/login">
								Entrar para registrar progresso
							</Link>
						)}
						{user && !progress && (
							<p className="ui-muted text-sm">
								O progresso está indisponível no momento.
							</p>
						)}
					</>
				)}
				{library}
			</section>
		</LessonTransition>
	);
	if (
		trail === "elementar" &&
		user &&
		progress &&
		round === 1 &&
		!row?.completedAt &&
		index > 0 &&
		index % 6 === 0
	)
		return (
			<LessonSession
				key={entry.key}
				number={Math.floor(index / 6) + 1}
				total={Math.ceil(lesson.length / 6)}
			>
				{content}
			</LessonSession>
		);
	return content;
}
