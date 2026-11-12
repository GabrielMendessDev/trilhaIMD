"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import Link from "~/app/_components/action-link";
import { useFeedback } from "~/app/_components/feedback";
import { navigateLearning } from "~/app/_components/learning-navigation";
import { publishRpg, rpgRequest } from "~/app/_components/rpg-client";
import { RpgIcon } from "~/app/_components/rpg-icon";
import type { RpgState } from "~/server/rpg";
import type { StageModel } from "./model";

export type LessonEffects = {
	hint?: string;
	example?: string;
	removed: string[];
	variant: string;
	model: StageModel;
	lives?: number;
};
type Bag = {
	inventory: (RpgState["inventory"][number] & { reason: string | null })[];
} & LessonEffects;
export function LessonBag({
	pointId,
	entryKey,
	round,
	disabled,
	onApply,
	onBusy,
	run = 1,
}: {
	pointId: number;
	entryKey: string;
	round: 1 | 2;
	disabled: boolean;
	onApply: (effects: LessonEffects) => void;
	onBusy: (value: boolean) => void;
	run?: number;
}) {
	const [bag, setBag] = useState<Bag | null>(null),
		[busy, setBusy] = useState(""),
		[error, setError] = useState(""),
		[confirm, setConfirm] = useState("");
	const dialog = useRef<HTMLDialogElement>(null),
		lock = useRef(false),
		operation = useRef<{ item: string; id: string } | null>(null);
	const router = useRouter();
	const { startNavigation } = useFeedback();
	const [, transition] = useTransition();
	async function load() {
		const response = await fetch(
			`/api/rpg?${new URLSearchParams({ pointId: String(pointId), entryKey, round: String(round) })}`,
			{ cache: "no-store", signal: AbortSignal.timeout(20000) },
		);
		const value = await response.json();
		if (!response.ok) throw new Error(value.error);
		setBag(value as Bag);
	}
	async function open() {
		if (disabled) return;
		dialog.current?.showModal();
		setBusy("loading");
		setError("");
		try {
			await load();
		} catch (e) {
			setError(
				e instanceof Error
					? e.message
					: "Não foi possível abrir. Tente novamente.",
			);
		} finally {
			setBusy("");
		}
	}
	async function applyItem(itemId: string) {
		if (lock.current || disabled) return;
		if (itemId === "question-pass" && confirm !== itemId) {
			setConfirm(itemId);
			return;
		}
		lock.current = true;
		onBusy(true);
		setBusy(itemId);
		setError("");
		if (operation.current?.item !== itemId)
			operation.current = { item: itemId, id: crypto.randomUUID() };
		try {
			const value = await rpgRequest<{
				result: LessonEffects & { destination?: string };
				state: RpgState;
			}>({
				action: "use",
				itemId,
				pointId,
				entryKey,
				round,
				lessonRun: run,
				confirmed: confirm === itemId,
				requestId: operation.current.id,
			});
			publishRpg(value.state);
			operation.current = null;
			setConfirm("");
			if (value.result.destination) {
				const destination = value.result.destination;
				dialog.current?.close();
				startNavigation(destination);
				navigateLearning(() =>
					transition(() => {
						if (
							destination !==
							`${window.location.pathname}${window.location.search}`
						)
							router.push(destination);
						// Item mutations happen outside a Server Action: invalidate the
						// cached lesson instead of reloading the old question's bag.
						router.refresh();
					}),
				);
				return;
			}
			onApply(value.result);
			await load();
			dialog.current?.close();
		} catch (e) {
			setError(
				e instanceof Error
					? e.message
					: "Não foi possível usar. Tente novamente.",
			);
		} finally {
			lock.current = false;
			onBusy(false);
			setBusy("");
		}
	}
	return (
		<>
			<button
				className="rpg-open-bag"
				disabled={disabled}
				onClick={() => void open()}
				type="button"
			>
				<RpgIcon name="bag" />
				Mochila<span>Usar recurso</span>
			</button>
			<dialog
				aria-labelledby="lesson-bag-title"
				className="rpg-lesson-bag"
				onCancel={(e) => {
					if (lock.current) e.preventDefault();
				}}
				ref={dialog}
			>
				<header>
					<div>
						<RpgIcon name="bag" />
						<h2 id="lesson-bag-title">Mochila da lição</h2>
					</div>
					<button
						aria-label="Fechar Mochila"
						className="rpg-close"
						disabled={Boolean(busy)}
						onClick={() => dialog.current?.close()}
						type="button"
					>
						Fechar
					</button>
				</header>
				<p>
					Use apenas quando precisar. Auxílios retiram a elegibilidade de lição
					perfeita.
				</p>
				{busy === "loading" && <p role="status">Consultando seus itens…</p>}
				{error && (
					<p className="study-error" role="alert">
						{error}
					</p>
				)}
				{!bag && error && (
					<button
						className="ui-button"
						onClick={() => void open()}
						type="button"
					>
						Tentar novamente
					</button>
				)}
				<ul>
					{bag?.inventory
						.filter((i) => i.kind === "consumable" && i.id !== "streak-shield")
						.sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0))
						.map((i) => (
							<li
								data-rarity={i.rarity}
								data-using={busy === i.id || undefined}
								key={i.id}
							>
								<RpgIcon name={i.id} />
								<div>
									<h3>
										{i.name}
										<span>×{i.quantity}</span>
									</h3>
									<p>{i.description}</p>
									{i.reason && <small>{i.reason}</small>}
									{!i.quantity && <small>Sem unidades na Mochila.</small>}
									{confirm === i.id ? (
										<div className="rpg-skip-confirm">
											<p>
												Esta questão ficará sem pontuação e não voltará na
												revisão. Confirmar?
											</p>
											<button
												className="ui-button"
												disabled={Boolean(busy)}
												onClick={() => void applyItem(i.id)}
												type="button"
											>
												Confirmar pulo
											</button>
											<button
												className="ui-link"
												disabled={Boolean(busy)}
												onClick={() => setConfirm("")}
												type="button"
											>
												Cancelar
											</button>
										</div>
									) : (
										<button
											className="ui-button"
											data-variant="secondary"
											disabled={
												Boolean(busy) || !i.quantity || Boolean(i.reason)
											}
											onClick={() => void applyItem(i.id)}
											type="button"
										>
											{busy === i.id ? "Aplicando…" : "Usar item"}
										</button>
									)}
								</div>
							</li>
						))}
				</ul>
				<footer>
					<Link className="ui-link" href="/loja">
						Repor itens na Loja do Bito
					</Link>
					<span>O escudo e os cosméticos ficam na Mochila da conta.</span>
				</footer>
			</dialog>
		</>
	);
}
export function applyLens(
	model: StageModel,
	removed: readonly string[],
): StageModel {
	if ("activity" in model && model.activity.kind === "multipla-escolha")
		return {
			...model,
			activity: {
				...model.activity,
				choices: model.activity.choices.filter((c) => !removed.includes(c.id)),
			},
		};
	return model;
}
