"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { rpgRequest } from "~/app/_components/rpg-client";

export function LessonRestart({
	pointId,
	run,
}: {
	pointId: number;
	run: number;
}) {
	const request = useRef<string | null>(null),
		lock = useRef(false);
	const [busy, setBusy] = useState(false),
		[error, setError] = useState("");
	const [navigating, transition] = useTransition();
	const router = useRouter();
	async function restart() {
		if (lock.current) return;
		lock.current = true;
		setBusy(true);
		setError("");
		request.current ??= crypto.randomUUID();
		try {
			const result = await rpgRequest<{ destination: string }>({
				action: "restart",
				pointId,
				lessonRun: run,
				requestId: request.current,
			});
			transition(() => {
				router.replace(result.destination);
				router.refresh();
			});
		} catch (e) {
			setError(
				e instanceof Error
					? e.message
					: "Não foi possível recomeçar. Tente novamente.",
			);
		} finally {
			lock.current = false;
			setBusy(false);
		}
	}
	return (
		<div>
			<button
				className="ui-button"
				disabled={busy || navigating}
				onClick={() => void restart()}
				type="button"
			>
				{busy || navigating ? "Recomeçando…" : "Recomeçar com 5 vidas"}
			</button>
			{error && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
