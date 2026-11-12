"use client";
import { useEffect, useState } from "react";
import { rarityNames } from "~/domain/rpg";
import Link from "./action-link";
import { consumeFeedbackEvent } from "./feedback-events";
import type { RpgBalance } from "./rpg-client";
import { RpgIcon, RpgMedal } from "./rpg-icon";

export function RpgBalances({ initial }: { initial: RpgBalance }) {
	const [value, setValue] = useState(initial);
	useEffect(() => setValue(initial), [initial]);
	useEffect(() => {
		const listen = (event: Event) => {
			const next = (event as CustomEvent<RpgBalance>).detail;
			if (next.account === initial.account) setValue(next);
		};
		window.addEventListener("trilbit:rpg", listen);
		return () => window.removeEventListener("trilbit:rpg", listen);
	}, [initial.account]);
	return (
		<div
			className="rpg-balances"
			key={`${value.xp}:${value.bits}:${value.streak}`}
		>
			<span
				className="rpg-streak"
				data-protected={value.protected || undefined}
				title={
					value.protected
						? "Ofensiva protegida para o próximo dia perdido"
						: "Dias de estudo válidos"
				}
			>
				<RpgIcon name="ofensiva" />
				{value.protected && (
					<RpgIcon className="rpg-flame-shield" name="streak-shield" />
				)}
				{value.streak}
				<span className="sr-only"> dias de ofensiva</span>
			</span>
			<span data-rpg-xp>{value.xp.toLocaleString("pt-BR")} XP</span>
			<Link
				aria-label={`${value.bits} Bits. Abrir Loja do Bito`}
				className="rpg-bits"
				href="/loja"
				title="Abrir Loja do Bito"
			>
				<RpgIcon name="bits" />
				<span data-rpg-bits>{value.bits.toLocaleString("pt-BR")}</span>
				<span className="rpg-bits-word"> Bits</span>
			</Link>
			<Link aria-label="Abrir Mochila" className="rpg-bag-link" href="/mochila">
				<RpgIcon name="bag" />
			</Link>
		</div>
	);
}
export function RpgAwardNotice({ account }: { account: string }) {
	const [awards, setAwards] = useState<RpgBalance["awards"]>([]);
	useEffect(() => {
		const listen = (event: Event) => {
			const value = (event as CustomEvent<RpgBalance>).detail;
			if (value.account !== account) return;
			const fresh = value.awards.filter((a) =>
				consumeFeedbackEvent(
					() => window.localStorage,
					`rpg-award:${account}:${a.id}`,
				),
			);
			if (fresh.length) setAwards(fresh);
		};
		window.addEventListener("trilbit:rpg", listen);
		return () => window.removeEventListener("trilbit:rpg", listen);
	}, [account]);
	if (!awards.length) return null;
	return (
		<aside
			aria-label="Novas conquistas"
			className="rpg-award-reveal"
			role="status"
		>
			<button
				aria-label="Fechar novas conquistas"
				className="rpg-close"
				onClick={() => setAwards([])}
				type="button"
			>
				Fechar
			</button>
			<h2>Você conquistou!</h2>
			<div className="rpg-award-strip">
				{awards.map((a) => (
					<div data-rarity={a.rarity} key={a.id}>
						<RpgMedal category={a.category} goal={a.goal} symbol={a.symbol} />
						<strong>{a.name}</strong>
						<small className="rpg-rarity">{rarityNames[a.rarity]}</small>
						<span>
							+{a.xp} XP · +{a.bits} Bits
						</span>
					</div>
				))}
			</div>
			<Link className="ui-link" href="/conquistas">
				Consultar conquistas
			</Link>
		</aside>
	);
}
