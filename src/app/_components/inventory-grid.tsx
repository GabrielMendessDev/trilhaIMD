"use client";
import { useState } from "react";
import { rarityNames } from "~/domain/rpg";
import type { RpgState } from "~/server/rpg";
import Link from "./action-link";
import { RpgIcon } from "./rpg-icon";
export function InventoryGrid({
	items,
	busy,
	onEquip,
	onArm,
	shieldActive,
	streak,
}: {
	items: RpgState["inventory"];
	busy: string;
	onEquip: (id: string, equipped: boolean) => void;
	onArm: (id: string) => void;
	shieldActive: boolean;
	streak: number;
}) {
	const [inspected, setInspected] = useState(items[0]?.id ?? "");
	const selected = items.find((i) => i.id === inspected) ?? items[0];
	if (!selected) return null;
	return (
		<div className="inventory-workbench">
			<ul aria-label="Itens da Mochila" className="inventory-slots">
				{items.map((i) => (
					<li
						className="rpg-item inventory-slot"
						data-rarity={i.rarity}
						key={i.id}
					>
						<button
							aria-pressed={selected.id === i.id}
							onClick={() => setInspected(i.id)}
							type="button"
						>
							<RpgIcon name={i.id} />
							<span className="slot-quantity">×{i.quantity}</span>
							<h2>{i.name}</h2>
							<small>{i.equipped ? "Equipado" : rarityNames[i.rarity]}</small>
						</button>
					</li>
				))}
			</ul>
			<aside
				aria-label="Detalhes do item selecionado"
				className="inventory-inspector"
				data-rarity={selected.rarity}
			>
				<RpgIcon name={selected.id} />
				<h2>{selected.name}</h2>
				<span className="rpg-rarity">
					{rarityNames[selected.rarity]} ·{" "}
					{selected.kind === "permanent" ? "Permanente" : "Consumível"}
				</span>
				<p>{selected.description}</p>
				<dl>
					<div>
						<dt>Na sua Mochila</dt>
						<dd>{selected.quantity}</dd>
					</div>
					<div>
						<dt>Estado</dt>
						<dd>{selected.equipped ? "Equipado" : "Disponível"}</dd>
					</div>
				</dl>
				{selected.kind === "permanent" ? (
					<button
						className="ui-button"
						disabled={Boolean(busy)}
						onClick={() => onEquip(selected.id, !selected.equipped)}
						type="button"
					>
						{busy === selected.id
							? "Salvando…"
							: selected.equipped
								? "Desequipar"
								: "Equipar item"}
					</button>
				) : selected.id === "streak-shield" ? (
					<button
						className="ui-button"
						disabled={Boolean(busy) || shieldActive || !streak}
						onClick={() => onArm(selected.id)}
						type="button"
					>
						{shieldActive ? "Escudo já ativo" : "Ativar proteção"}
					</button>
				) : (
					<Link className="ui-button" href="/aprender">
						Usar numa lição
					</Link>
				)}
				<small>
					{selected.kind === "permanent"
						? "Você pode equipar ou guardar este cosmético quando quiser."
						: selected.id === "streak-shield"
							? "Ative antes de perder um dia; é preciso ter uma ofensiva em andamento."
							: "Abra a mochila durante uma questão para conferir a compatibilidade e usar o recurso."}
				</small>
			</aside>
		</div>
	);
}
