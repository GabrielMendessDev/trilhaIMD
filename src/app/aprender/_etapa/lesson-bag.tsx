"use client";
import { useRef, useState } from "react";
import Link from "~/app/_components/action-link";
import {
	publishRpg,
	type RpgBalance,
	rpgRequest,
} from "~/app/_components/rpg-client";
import { RpgIcon } from "~/app/_components/rpg-icon";
import { items } from "~/domain/rpg";
import type { LessonBagView, LessonCursor } from "./lesson-view";
import type { StageModel } from "./model";

export function LessonBag({
	bag,
	inventory,
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
	bag: LessonBagView;
	inventory: Record<string, number>;
	onApply: (
		cursor: LessonCursor,
		inventory: Record<string, number>,
		destination?: string,
	) => void;
	onBusy: (value: boolean) => void;
	run?: number;
}) {
	const [busy, setBusy] = useState(""),
		[error, setError] = useState(""),
		[confirm, setConfirm] = useState("");
	const dialog = useRef<HTMLDialogElement>(null),
		lock = useRef(false),
		operation = useRef<{ item: string; id: string } | null>(null);
	function open() {
		if (disabled) return;
		setError("");
		setConfirm("");
		dialog.current?.showModal();
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
				result: { cursor?: LessonCursor; destination?: string };
				rpg: RpgBalance;
				inventory: Record<string, number>;
			}>({
				action: "use",
				itemId,
				pointId,
				entryKey,
				round,
				lessonRun: run,
				lessonFlow: true,
				confirmed: confirm === itemId,
				requestId: operation.current.id,
			});
			if (!value.result.cursor)
				throw new Error("Atualize a lição para recuperar o estado da questão.");
			publishRpg(value.rpg);
			operation.current = null;
			setConfirm("");
			dialog.current?.close();
			onApply(value.result.cursor, value.inventory, value.result.destination);
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
				onClick={open}
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
				{error && (
					<p className="study-error" role="alert">
						{error}
					</p>
				)}
				<ul>
					{items
						.filter((i) => i.kind === "consumable" && i.id !== "streak-shield")
						.map((i) => ({
							...i,
							quantity: inventory[i.id] ?? 0,
							reason: bag.reasons[i.id],
						}))
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
