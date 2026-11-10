import Image from "next/image";
import Link from "~/app/_components/action-link";
import { Icon, ProgressBar } from "~/app/_components/dashboard";
import {
	CompletionEffects,
	RewardValue,
} from "~/app/_components/reward-effects";
import { auth } from "~/server/auth";
import type { PublishedPoint } from "~/server/learning";
import {
	getLearningProgress,
	getPublishedPoints,
	getTrailStatus,
} from "~/server/learning";
import { newAchievementsAt } from "~/server/learning-metrics";
import {
	feedbackFor,
	getLesson,
	isGraded,
	lessonItems,
	toStageModel,
} from "~/server/lesson";
import {
	type LessonProgress,
	lessonScore,
	pendingItem,
} from "~/server/lesson-progress";
import { trailMapHref } from "../trails";
import { ContentPanel } from "./content";
import { Walkthrough } from "./controls";
import { LessonForm } from "./lesson-form";
import { AnswerMotion, LessonTransition } from "./lesson-motion";
import { LessonNotice } from "./lesson-notice";
import styles from "./pedagogy.module.css";
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
	const [session, catalog, lesson] = await Promise.all([
		auth(),
		getPublishedPoints(),
		getLesson(id),
	]);
	const user = session?.user;
	const progress = user ? await getLearningProgress(user.id) : null;
	const { published, completed, next } = getTrailStatus(
		catalog ?? [],
		progress,
		trail,
	);
	const row = progress?.rows.find((item) => item.pointId === id);
	const state = row ?? emptyProgress;
	const items = lessonItems(lesson);
	const models = lesson.map((entry) => ({ entry, model: toStageModel(entry) }));
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
		attempt && lesson.find(({ key }) => key === feedbackKey);
	if (attempt && feedbackEntry && isGraded(feedbackEntry)) {
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
		const message = attempt.correct
			? feedbackRound === 1
				? "Mandou bem!"
				: "Você conseguiu na revisão!"
			: feedbackRound === 1
				? "Ainda não foi dessa vez!"
				: "Vamos entender a resposta";
		return (
			<div className="mt-4 space-y-4">
				<AnswerMotion
					className={styles.feedback}
					correct={attempt.correct}
					eventId={`answer:${user?.id}:${point.id}:${feedbackKey}:${feedbackRound}`}
				>
					<div className={styles.feedbackHeader}>
						<span className={styles.feedbackIcon}>
							{attempt.correct ? (
								<Icon name="check" />
							) : (
								<svg aria-hidden="true" viewBox="0 0 24 24">
									<path d="m7 7 10 10M17 7 7 17" />
								</svg>
							)}
						</span>
						<LessonNotice
							correct={attempt.correct}
							eventId={`answer:${user?.id}:${point.id}:${feedbackKey}:${feedbackRound}`}
							key={`${feedbackKey}-${feedbackRound}`}
							message={message}
						/>
					</div>
					<div className="space-y-2">
						<p className={styles.secondary}>
							Questão{" "}
							{items
								.filter(({ graded }) => graded)
								.findIndex(({ key }) => key === feedbackKey) + 1}{" "}
							de {items.filter(({ graded }) => graded).length} ·{" "}
							{feedbackRound === 2 ? "Revisão" : "Primeira rodada"}
						</p>
						<ProgressBar
							label="Andamento da lição"
							value={(state.completedEntries.length / lesson.length) * 100}
						/>
					</div>
					<p className={styles.feedbackPrompt}>{feedbackEntry.prompt}</p>
					<ul
						aria-label={attempt.correct ? "Resposta correta" : "Sua resposta"}
						className={styles.answerList}
					>
						{result.chosen.map(({ id, label, value }) => (
							<li key={id}>
								{label && <strong>{label} · </strong>}
								{value}
							</li>
						))}
					</ul>
					{result.hint && (
						<>
							<p>{result.hint}</p>
							<p className={styles.secondary}>
								Esta questão volta no fim da primeira rodada.
							</p>
						</>
					)}
					{result.solution.length > 0 && (
						<div className={styles.solution}>
							<h3>Resposta correta</h3>
							<ul>
								{result.solution.map(({ id, label, value }) => (
									<li key={id}>
										{label && <strong>{label} · </strong>}
										{value}
									</li>
								))}
							</ul>
						</div>
					)}
					{result.explanation && <p>{result.explanation}</p>}
					{example &&
						"activity" in example &&
						example.activity.kind === "passo-a-passo" && (
							<details className={styles.workedExample}>
								<summary>Ver exemplo resolvido da atividade</summary>
								{example.activity.prompt && <p>{example.activity.prompt}</p>}
								<Walkthrough steps={example.activity.steps} />
							</details>
						)}
					{feedbackRound === 2 && (
						<p className={styles.secondary}>
							{attempt.correct
								? "Questão recuperada na revisão."
								: "Questão registrada como ponto para estudar."}
						</p>
					)}
					<Link className="ui-button w-fit" href={base}>
						{row?.completedAt ? "Ver meu resultado" : "Continuar"}{" "}
						<Icon className="size-4" name="arrow" />
					</Link>
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
		const awards = newAchievementsAt(progress?.rows ?? [], id);
		const completionId = `completion:${user?.id}:${id}:${row.completedAt.toISOString()}`;
		return (
			<div className="mt-4 space-y-4">
				<CompletionEffects
					awards={awards}
					eventId={completionId}
					reward={row.xp}
					unlocked={upcoming?.number}
				>
					<section aria-labelledby="lesson-result" className={styles.result}>
						<div className={styles.resultHeader}>
							<div>
								<h2 id="lesson-result">
									<Icon className="completion-medal" name="trophy" />
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
						</dl>
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
							<Link
								className="ui-button"
								href={
									upcoming
										? `/aprender/${trail}/${upcoming.number}`
										: trailMapHref(trail, number)
								}
							>
								{upcoming ? "Próxima etapa" : "Voltar ao mapa"}
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
	const index = lesson.indexOf(entry);
	const round = pending?.round ?? 1;
	const retryQueue =
		round === 2
			? items.filter(({ key }) => state.attempts[key]?.[0]?.correct === false)
			: [];
	const retryIndex = retryQueue.findIndex(({ key }) => key === entry.key);
	const gradedItems = items.filter(({ graded }) => graded);
	const questionIndex = gradedItems.findIndex(({ key }) => key === entry.key);

	return (
		<LessonTransition
			key={`${entry.key}-${round}`}
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
								tentativa em cada uma.
							</p>
						</div>
					</div>
				)}
				<div className="space-y-2">
					<p className="ui-muted font-semibold text-sm">
						{round === 2
							? `Revisão ${retryIndex + 1} de ${retryQueue.length}`
							: questionIndex >= 0
								? `Questão ${questionIndex + 1} de ${gradedItems.length} · Tela ${index + 1} de ${lesson.length}`
								: `Material de estudo · Tela ${index + 1} de ${lesson.length}`}
					</p>
					<ProgressBar
						label={round === 2 ? "Andamento da revisão" : "Andamento da lição"}
						value={
							row?.completedAt
								? 100
								: round === 2
									? (retryIndex / retryQueue.length) * 100
									: (state.completedEntries.length / lesson.length) * 100
						}
					/>
				</div>
				{user && progress && !row?.completedAt ? (
					<LessonForm
						endpoint={`${base}/responder`}
						entryKey={entry.key}
						key={`${entry.key}-${round}`}
						label={isGraded(entry) ? "Verificar resposta" : "Continuar"}
						round={round}
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
}
