"use client";

import { useRouter } from "next/navigation";
import {
	type FormEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { ActionButton } from "~/app/_components/action-button";
import { useFeedback } from "~/app/_components/feedback";
import { Icon } from "~/app/_components/icon";

export function LessonForm({
	endpoint,
	entryKey,
	round,
	children,
	label,
}: {
	endpoint: string;
	entryKey: string;
	round: 1 | 2;
	children: ReactNode;
	label: string;
}) {
	const [state, setState] = useState<
		"idle" | "submitting" | "navigating" | "error"
	>("idle");
	const pending = state === "submitting" || state === "navigating";
	const router = useRouter();
	const [changing, transition] = useTransition();
	const { notify, startNavigation, finishNavigation, dismiss } = useFeedback();
	const submitting = useRef(false);
	const [error, setError] = useState("");
	useEffect(() => {
		if (state === "navigating" && !changing) {
			setState("idle");
			submitting.current = false;
			finishNavigation();
		}
	}, [state, changing, finishNavigation]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submitting.current) return;
		const form = new FormData(event.currentTarget);
		submitting.current = true;
		setState("submitting");
		setError("");
		dismiss("lesson-request");
		try {
			const response = await fetch(endpoint, {
				method: "POST",
				body: form,
				signal: AbortSignal.timeout(20000),
			});
			const result: { destination?: string; error?: string } =
				await response.json();
			if (response.ok && result.destination) {
				setState("navigating");
				startNavigation(result.destination);
				transition(() => {
					if (
						result.destination ===
						`${window.location.pathname}${window.location.search}`
					)
						router.refresh();
					else router.push(result.destination as string);
				});
				return;
			}
			const message =
				result.error ?? "Não foi possível salvar. Tente novamente.";
			setError(message);
			notify({ id: "lesson-request", kind: "error", message });
		} catch {
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
			className="space-y-4"
			data-question-state={state}
			method="post"
			onSubmit={submit}
		>
			<input name="item" type="hidden" value={entryKey} />
			<input name="rodada" type="hidden" value={round} />
			<fieldset className="min-w-0" disabled={pending}>
				{children}
			</fieldset>
			{error && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
			<ActionButton
				busy={pending}
				busyLabel={state === "navigating" ? "Abrindo…" : "Conferindo…"}
				state={state === "error" ? "error" : undefined}
				type="submit"
			>
				{label} <Icon className="size-4" name="arrow" />
			</ActionButton>
		</form>
	);
}
