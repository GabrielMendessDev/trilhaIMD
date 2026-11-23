"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	type FormEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
	useTransition,
} from "react";
import { ActionButton } from "~/app/_components/action-button";
import { activeStudyTime } from "~/app/_components/analytics-client";
import { useFeedback } from "~/app/_components/feedback";
import { consumeFeedbackEvent } from "~/app/_components/feedback-events";
import { FeedbackIcon } from "~/app/_components/feedback-icon";
import { Icon } from "~/app/_components/icon";
import { navigateLearning } from "~/app/_components/learning-navigation";
import { ProgressBar } from "~/app/_components/progress-bar";
import { publishRpg, type RpgBalance } from "~/app/_components/rpg-client";
import type { AnswerAssessment } from "./answer-model";
import { AnswerResult } from "./answer-result";
import { applyLens, LessonBag, type LessonEffects } from "./lesson-bag";
import { LessonLives } from "./lesson-lives";
import { QuestionHelp } from "./question-help";
import { StageScreen } from "./screen";

let responderWarmed = false;

export function LessonForm({
	endpoint,
	entryKey,
	round,
	children,
	label,
	progress,
	example,
	autoSubmit = false,
	bag,
	lives = 5,
	run = 1,
}: {
	endpoint: string;
	entryKey: string;
	round: 1 | 2;
	children: ReactNode;
	label: string;
	progress?: number;
	example?: ReactNode;
	autoSubmit?: boolean;
	bag?: { pointId: number; effects: LessonEffects };
	lives?: number;
	run?: number;
}) {
	const [effects, setEffects] = useState(bag?.effects);
	const [currentLives, setCurrentLives] = useState(lives);
	const [itemBusy, setItemBusy] = useState(false);
	const statusId = useId();
	const [state, setState] = useState<
		"idle" | "submitting" | "navigating" | "error" | "correct" | "incorrect"
	>("idle");
	const router = useRouter();
	const search = useSearchParams();
	const [changing, transition] = useTransition();
	const { notify, startNavigation, finishNavigation, dismiss } = useFeedback();
	const submitting = useRef(false);
	const [error, setError] = useState("");
	const [confirmed, setConfirmed] = useState<{
		assessment: AnswerAssessment;
		destination: string;
		animate: boolean;
	} | null>(null);
	// Native history restoration is queued by Next. Reveal the continuation only
	// after that router state commits, so a fast click cannot be superseded by it.
	const visibleResult =
		confirmed &&
		search.get("retorno") === entryKey &&
		search.get("rodada") === String(round)
			? confirmed
			: null;
	const pending =
		state === "submitting" ||
		state === "navigating" ||
		Boolean(confirmed && !visibleResult);
	const request = useRef<AbortController | null>(null);
	const questionClock = useRef({ visibleSince: 0, elapsed: 0 });
	useEffect(() => {
		if (!autoSubmit) return;
		const clock = questionClock.current;
		clock.elapsed = 0;
		clock.visibleSince = document.hidden ? 0 : performance.now();
		const visibility = () => {
			if (clock.visibleSince)
				clock.elapsed += performance.now() - clock.visibleSince;
			clock.visibleSince = document.hidden ? 0 : performance.now();
		};
		document.addEventListener("visibilitychange", visibility);
		return () => document.removeEventListener("visibilitychange", visibility);
	}, [autoSubmit]);
	useEffect(() => () => request.current?.abort(), []);
	useEffect(() => {
		if (process.env.NODE_ENV !== "development" || responderWarmed) return;
		// Compile the on-demand route while the student is reading the lesson.
		responderWarmed = true;
		void fetch(endpoint, { method: "OPTIONS" }).then(
			(response) => {
				if (!response.ok) responderWarmed = false;
			},
			() => {
				responderWarmed = false;
			},
		);
	}, [endpoint]);
	useEffect(() => {
		if (state === "navigating" && !changing) {
			setState("idle");
			submitting.current = false;
			finishNavigation();
		}
	}, [state, changing, finishNavigation]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await send(event.currentTarget);
	}

	async function send(element: HTMLFormElement) {
		if (submitting.current || confirmed || itemBusy) return;
		const form = new FormData(element);
		const activeMs = activeStudyTime();
		if (autoSubmit && activeMs !== undefined) {
			const { elapsed, visibleSince } = questionClock.current;
			const responseMs =
				elapsed + (visibleSince ? performance.now() - visibleSince : 0);
			form.set("metricResponseMs", String(Math.round(responseMs)));
			form.set("metricActiveMs", String(Math.round(activeMs)));
		}
		submitting.current = true;
		setState("submitting");
		setError("");
		dismiss("lesson-request");
		try {
			request.current = new AbortController();
			const response = await fetch(endpoint, {
				method: "POST",
				body: form,
				signal: AbortSignal.any([
					request.current.signal,
					AbortSignal.timeout(20000),
				]),
			});
			const result: {
				destination?: string;
				continueTo?: string;
				error?: string;
				assessment?: AnswerAssessment;
				rpg?: RpgBalance;
			} = await response.json();
			if (response.ok && result.destination) {
				if (result.rpg) publishRpg(result.rpg);
				if (result.assessment) {
					finishNavigation();
					// Keep the same controls and selection mounted. Reload restores this saved result.
					window.history.replaceState(null, "", result.destination);
					setConfirmed({
						assessment: result.assessment,
						destination:
							result.continueTo ?? endpoint.replace(/\/responder$/, ""),
						animate: consumeFeedbackEvent(
							() => window.sessionStorage,
							`${result.assessment.eventId}:motion`,
						),
					});
					setState(result.assessment.correct ? "correct" : "incorrect");
					return;
				}
				startNavigation(result.destination);
				navigateLearning(() => {
					setState("navigating");
					transition(() => {
						if (
							result.destination ===
							`${window.location.pathname}${window.location.search}`
						)
							router.refresh();
						else router.push(result.destination as string);
					});
				});
				return;
			}
			const message =
				result.error ?? "Não foi possível salvar. Tente novamente.";
			setError(message);
			notify({ id: "lesson-request", kind: "error", message });
		} catch {
			if (request.current?.signal.aborted) return;
			const message =
				"Não foi possível confirmar o envio. Sua escolha foi mantida. Tente novamente.";
			setError(message);
			notify({ id: "lesson-request", kind: "error", message });
		}
		setState("error");
		submitting.current = false;
	}

	return (
		<form
			action={endpoint}
			aria-busy={pending}
			aria-describedby={autoSubmit && !confirmed ? statusId : undefined}
			className="answer-experience space-y-4"
			data-animate={visibleResult?.animate ? "true" : undefined}
			data-auto-submit={autoSubmit || undefined}
			data-outcome={
				visibleResult
					? visibleResult.assessment.correct
						? "success"
						: "error"
					: undefined
			}
			data-question-state={state}
			method="post"
			onChange={(event) => {
				const target = event.target;
				if (
					autoSubmit &&
					(target instanceof HTMLInputElement ||
						target instanceof HTMLSelectElement) &&
					target.name.startsWith("resposta") &&
					event.currentTarget.checkValidity()
				)
					void send(event.currentTarget);
			}}
			onSubmit={submit}
		>
			<input name="item" type="hidden" value={entryKey} />
			<input name="rodada" type="hidden" value={round} />
			<input name="run" type="hidden" value={run} />
			<input name="variant" type="hidden" value={effects?.variant ?? ""} />
			<LessonLives
				lives={confirmed?.assessment.lives ?? currentLives}
				review={round === 2}
			/>
			{bag && autoSubmit && !confirmed && (
				<LessonBag
					disabled={pending || itemBusy}
					entryKey={entryKey}
					onApply={(value) => {
						setEffects(value);
						if (value.lives !== undefined) setCurrentLives(value.lives);
					}}
					onBusy={setItemBusy}
					pointId={bag.pointId}
					round={round}
					run={run}
				/>
			)}
			{progress !== undefined && (
				<ProgressBar
					label={round === 2 ? "Andamento da revisão" : "Andamento da lição"}
					value={confirmed?.assessment.progress ?? progress}
				/>
			)}
			<fieldset
				className="answer-controls min-w-0"
				disabled={pending || Boolean(confirmed) || itemBusy}
			>
				{effects ? (
					<StageScreen
						key={effects.variant}
						model={applyLens(effects.model, effects.removed)}
						response
					/>
				) : (
					children
				)}
			</fieldset>
			<QuestionHelp example={effects?.example} hint={effects?.hint} />
			{autoSubmit && !visibleResult && (
				<p className="answer-auto-status" id={statusId} role="status">
					<FeedbackIcon kind={pending ? "loading" : "info"} />
					{pending
						? "Conferindo sua resposta…"
						: "Escolha sua resposta. A correção aparece aqui."}
				</p>
			)}
			{error && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
			{visibleResult ? (
				<AnswerResult
					animate={visibleResult.animate}
					assessment={visibleResult.assessment}
					destination={visibleResult.destination}
					example={example}
				/>
			) : !autoSubmit ? (
				<ActionButton
					busy={pending}
					busyLabel={label}
					state={state === "error" ? "error" : undefined}
					type="submit"
				>
					{label} <Icon className="size-4" name="arrow" />
				</ActionButton>
			) : state === "error" ? (
				<ActionButton
					onClick={(event) => {
						const form = event.currentTarget.form;
						if (form?.checkValidity()) void send(form);
					}}
					type="button"
				>
					Tentar novamente
				</ActionButton>
			) : null}
		</form>
	);
}
