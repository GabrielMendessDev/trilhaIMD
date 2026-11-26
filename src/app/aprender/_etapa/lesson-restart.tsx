"use client";
import { useRef, useState } from "react";
import { rpgRequest } from "~/app/_components/rpg-client";
import type { LessonCursor } from "./lesson-view";

export function LessonRestart({
	pointId,
	run,
	onRestart,
}: {
	pointId: number;
	run: number;
	onRestart: (cursor: LessonCursor, destination: string) => void;
}) {
	const request = useRef<string | null>(null),
		lock = useRef(false);
	const [busy, setBusy] = useState(false),
		[error, setError] = useState("");
	async function restart() {
		if (lock.current) return;
		lock.current = true;
		setBusy(true);
		setError("");
		request.current ??= crypto.randomUUID();
		try {
			const result = await rpgRequest<{
				cursor: LessonCursor;
				destination: string;
			}>({
				action: "restart",
				lessonFlow: true,
				pointId,
				lessonRun: run,
				requestId: request.current,
			});
			onRestart(result.cursor, result.destination);
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
				disabled={busy}
				onClick={() => void restart()}
				type="button"
			>
				{busy ? "Recomeçando…" : "Recomeçar com 5 vidas"}
			</button>
			{error && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
