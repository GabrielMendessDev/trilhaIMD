"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { publishRpg, rpgRequest } from "~/app/_components/rpg-client";
import type { RpgState } from "~/server/rpg";

type Reading = {
	completed: boolean;
	remaining: number;
	prompt: string;
	choices: { id: string; label: string }[];
	state: RpgState;
	awards: RpgState["achievements"];
};
export function MaterialCompletion({
	pointId,
	entryKey,
	onInventory,
}: {
	pointId: number;
	entryKey: string;
	onInventory: (stock: Record<string, number>) => void;
}) {
	const [reading, setReading] = useState<Reading | null>(null),
		[error, setError] = useState(""),
		[busy, setBusy] = useState(false);
	const lock = useRef(false);
	const request = useCallback(
		async (answer?: string) => {
			if (lock.current) return;
			lock.current = true;
			setBusy(true);
			setError("");
			try {
				const next = await rpgRequest<Reading>({
					action: "material",
					pointId,
					entryKey,
					answer,
				});
				setReading(next);
				onInventory(
					Object.fromEntries(
						next.state.inventory.map(({ id, quantity }) => [id, quantity]),
					),
				);
				publishRpg(next.state, next.awards);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Tente novamente.");
			} finally {
				lock.current = false;
				setBusy(false);
			}
		},
		[pointId, entryKey, onInventory],
	);
	useEffect(() => {
		void request();
	}, [request]);
	useEffect(() => {
		if (!reading?.remaining) return;
		const timer = setInterval(
			() =>
				setReading((current) =>
					current
						? { ...current, remaining: Math.max(0, current.remaining - 1) }
						: null,
				),
			1000,
		);
		return () => clearInterval(timer);
	}, [reading?.remaining]);
	return (
		<section className="rpg-material-check">
			<h2>
				{reading?.completed ? "Material concluído" : "Confira o que aprendeu"}
			</h2>
			{reading?.completed ? (
				<p>Leitura e verificação salvas na sua jornada.</p>
			) : (
				<>
					<p>
						Leia o material e resolva a verificação para registrar a conclusão.
					</p>
					{reading && (
						<fieldset disabled={busy || reading.remaining > 0}>
							<legend>{reading.prompt}</legend>
							{reading.choices.map((c) => (
								<button
									className="ui-button"
									data-variant="secondary"
									key={c.id}
									onClick={() => void request(c.id)}
									type="button"
								>
									{c.label}
								</button>
							))}
						</fieldset>
					)}
					{reading && reading.remaining > 0 && (
						<small>Verificação disponível em {reading.remaining}s.</small>
					)}
				</>
			)}
			{busy && <p role="status">Salvando leitura…</p>}
			{error && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
			{!reading && !busy && (
				<button
					className="ui-button"
					onClick={() => void request()}
					type="button"
				>
					Tentar novamente
				</button>
			)}
		</section>
	);
}
