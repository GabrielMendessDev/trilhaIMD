"use client";

import {
	type FormEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { ActionButton } from "~/app/_components/action-button";
import { activeStudyTime } from "~/app/_components/analytics-client";
import { useFeedback } from "~/app/_components/feedback";
import { consumeFeedbackEvent } from "~/app/_components/feedback-events";
import { FeedbackIcon } from "~/app/_components/feedback-icon";
import { Icon } from "~/app/_components/icon";
import { ProgressBar } from "~/app/_components/progress-bar";
import { publishRpg, type RpgBalance } from "~/app/_components/rpg-client";
import type { AnswerAssessment } from "./answer-model";
import { AnswerResult } from "./answer-result";
import { applyLens, LessonBag } from "./lesson-bag";
import { LessonLives } from "./lesson-lives";
import type { LessonCursor, LessonScreen } from "./lesson-view";
import { QuestionHelp } from "./question-help";
import { StageScreen } from "./screen";

export function LessonForm({
	endpoint,
	pointId,
	cursor,
	screen,
	inventory,
	active,
	example,
	onAdvance,
	onFeedback,
	onInventory,
	onUseItem,
}: {
	endpoint: string;
	pointId: number;
	cursor: Extract<LessonCursor, { kind: "step" }>;
	screen: LessonScreen;
	inventory: Record<string, number>;
	active: boolean;
	example?: ReactNode;
	onAdvance: (cursor: LessonCursor, destination: string) => void;
	onFeedback: (destination: string) => void;
	onInventory: (stock: Record<string, number>) => void;
	onUseItem: (
		cursor: LessonCursor,
		inventory: Record<string, number>,
		destination?: string,
	) => void;
}) {
	const { key, round, run, bag } = cursor;
	const autoSubmit = screen.graded;
	const effects = bag?.effects;
	const statusId = useId();
	const [itemBusy, setItemBusy] = useState(false);
	const [state, setState] = useState<
		"idle" | "submitting" | "error" | "correct" | "incorrect"
	>("idle");
	const { notify, dismiss } = useFeedback();
	const [error, setError] = useState("");
	const [confirmed, setConfirmed] = useState<{
		assessment: AnswerAssessment;
		destination: string;
		cursor: LessonCursor;
		animate: boolean;
	} | null>(null);
	const request = useRef<AbortController | null>(null);
	const questionClock = useRef({ visibleSince: 0, elapsed: 0 });
	useEffect(() => {
		if (!autoSubmit || !active) return;
		const clock = questionClock.current;
		const visibility = () => {
			const now = performance.now();
			if (clock.visibleSince) clock.elapsed += now - clock.visibleSince;
			clock.visibleSince = document.hidden ? 0 : now;
		};
		visibility();
		document.addEventListener("visibilitychange", visibility);
		return () => {
			document.removeEventListener("visibilitychange", visibility);
			if (clock.visibleSince)
				clock.elapsed += performance.now() - clock.visibleSince;
			clock.visibleSince = 0;
		};
	}, [autoSubmit, active]);
	useEffect(() => () => request.current?.abort(), []);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await send(event.currentTarget);
	}

	async function send(element: HTMLFormElement) {
		if (request.current || confirmed || itemBusy) return;
		const form = new FormData(element);
		form.set("lessonFlow", "1");
		const activeMs = activeStudyTime();
		if (autoSubmit && activeMs !== undefined) {
			const { elapsed, visibleSince } = questionClock.current;
			const responseMs =
				elapsed + (visibleSince ? performance.now() - visibleSince : 0);
			form.set("metricResponseMs", String(Math.round(responseMs)));
			form.set("metricActiveMs", String(Math.round(activeMs)));
		}
		const controller = new AbortController();
		request.current = controller;
		setState("submitting");
		setError("");
		dismiss("lesson-request");
		try {
			const response = await fetch(endpoint, {
				method: "POST",
				body: form,
				signal: AbortSignal.any([
					controller.signal,
					AbortSignal.timeout(20000),
				]),
			});
			const result: {
				destination?: string;
				continueTo?: string;
				error?: string;
				assessment?: AnswerAssessment;
				cursor?: LessonCursor;
				inventory?: Record<string, number>;
				rpg?: RpgBalance;
			} = await response.json();
			if (!response.ok || !result.destination || !result.cursor) {
				throw new Error(
					result.error ?? "Não foi possível salvar. Tente novamente.",
				);
			}
			if (result.rpg) publishRpg(result.rpg);
			if (result.inventory) onInventory(result.inventory);
			if (result.assessment) {
				onFeedback(result.destination);
				setConfirmed({
					assessment: result.assessment,
					destination:
						result.continueTo ?? endpoint.replace(/\/responder$/, ""),
					cursor: result.cursor,
					animate: consumeFeedbackEvent(
						() => window.sessionStorage,
						`${result.assessment.eventId}:motion`,
					),
				});
				setState(result.assessment.correct ? "correct" : "incorrect");
			} else {
				onAdvance(result.cursor, result.destination);
				setState("idle");
			}
		} catch (cause) {
			if (controller.signal.aborted) return;
			const message =
				cause instanceof Error && cause.name === "Error"
					? cause.message
					: "Não foi possível confirmar o envio. Sua escolha foi mantida. Tente novamente.";
			setError(message);
			setState("error");
			notify({ id: "lesson-request", kind: "error", message });
		} finally {
			request.current = null;
		}
	}

	const pending = state === "submitting";
	const model = effects?.model ?? screen.model;
	return (
		<form
			action={endpoint}
			aria-busy={pending}
			aria-describedby={autoSubmit && !confirmed ? statusId : undefined}
			className="answer-experience space-y-4"
			data-animate={confirmed?.animate ? "true" : undefined}
			data-auto-submit={autoSubmit || undefined}
			data-outcome={
				confirmed
					? confirmed.assessment.correct
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
			<input name="item" type="hidden" value={key} />
			<input name="rodada" type="hidden" value={round} />
			<input name="run" type="hidden" value={run} />
			<input name="variant" type="hidden" value={effects?.variant ?? ""} />
			<LessonLives
				lives={confirmed?.assessment.lives ?? cursor.lives}
				review={round === 2}
			/>
			{bag && !confirmed && (
				<LessonBag
					bag={bag}
					disabled={pending || itemBusy}
					entryKey={key}
					inventory={inventory}
					onApply={onUseItem}
					onBusy={setItemBusy}
					pointId={pointId}
					round={round}
					run={run}
				/>
			)}
			<ProgressBar
				label={round === 2 ? "Andamento da revisão" : "Andamento da lição"}
				value={confirmed?.assessment.progress ?? cursor.progress}
			/>
			<fieldset
				className="answer-controls min-w-0"
				disabled={pending || Boolean(confirmed) || itemBusy}
			>
				<StageScreen
					key={effects?.variant}
					model={effects ? applyLens(model, effects.removed) : model}
					response
				/>
			</fieldset>
			<QuestionHelp example={effects?.example} hint={effects?.hint} />
			{autoSubmit && !confirmed && (
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
			{confirmed ? (
				<AnswerResult
					animate={confirmed.animate}
					assessment={confirmed.assessment}
					destination={confirmed.destination}
					example={example}
					onContinue={() => onAdvance(confirmed.cursor, confirmed.destination)}
				/>
			) : !autoSubmit ? (
				<ActionButton
					busy={pending}
					busyLabel="Continuar"
					state={state === "error" ? "error" : undefined}
					type="submit"
				>
					Continuar <Icon className="size-4" name="arrow" />
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
