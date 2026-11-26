import { type SyntheticEvent, useEffect, useState } from "react";
import { achievements, items } from "~/domain/rpg";
import type { RpgHistoryData } from "~/server/rpg-history";
import { loadRpgHistory } from "./rpg-history-cache";

const date = (value: string) => new Date(value).toLocaleDateString("pt-BR");
export function RpgHistory({ account }: { account: string }) {
	const [open, setOpen] = useState(false);
	const [revision, setRevision] = useState(0);
	const [result, setResult] = useState<{
		revision?: number;
		data?: RpgHistoryData;
		error?: boolean;
	}>({});
	const refresh = () => setRevision((value) => value + 1);
	useEffect(() => {
		const update = () => setRevision((value) => value + 1);
		window.addEventListener("trilbit:rpg", update);
		return () => window.removeEventListener("trilbit:rpg", update);
	}, []);
	useEffect(() => {
		if (!open) return;
		let active = true;
		void loadRpgHistory(account).then(
			(data) => {
				if (active) setResult({ data, revision });
			},
			() => {
				if (active) setResult({ error: true, revision });
			},
		);
		return () => {
			active = false;
		};
	}, [account, open, revision]);
	const state = result.revision === revision ? result.data : undefined;
	const onToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
		setOpen(
			Boolean(
				event.currentTarget.parentElement?.querySelector("details[open]"),
			),
		);
	};
	const feedback =
		result.revision === revision && result.error ? (
			<div>
				<p role="alert">Não foi possível consultar o histórico.</p>
				<button className="ui-link" onClick={refresh} type="button">
					Tentar novamente
				</button>
			</div>
		) : (
			<p role="status">Consultando histórico…</p>
		);
	return (
		<section className="rpg-history" id="rpg-history">
			<h2>Histórico da Mochila</h2>
			<p>Compras, recompensas e usos confirmados na sua conta.</p>
			<details onToggle={onToggle}>
				<summary>
					Movimentações de Bits
					{state ? ` (${state.history.length} mais recentes)` : ""}
				</summary>
				{state ? (
					<>
						<ol>
							{state.history.map((row) => (
								<li key={row.id}>
									<div>
										<strong>
											{row.kind === "purchase"
												? items.find((i) => i.id === row.subject)?.name
												: row.kind === "achievement"
													? achievements.find((a) => a.id === row.subject)?.name
													: row.kind === "daily"
														? "Bônus diário"
														: row.kind === "level-overflow"
															? `Recompensa de nível convertida em Bits · Nível ${row.subject}`
															: "Conclusão de lição"}
										</strong>
										<small>{date(row.createdAt)}</small>
									</div>
									<span>
										{row.bits > 0 ? "+" : ""}
										{row.bits} Bits{row.xp > 0 ? ` · +${row.xp} XP` : ""}
										<small>Saldo após: {row.balanceAfter}</small>
									</span>
								</li>
							))}
						</ol>
						{!state.history.length && <p>Nenhuma movimentação registrada.</p>}
					</>
				) : (
					feedback
				)}
			</details>
			<details onToggle={onToggle}>
				<summary>
					Uso de itens{state ? ` (${state.usages.length} mais recentes)` : ""}
				</summary>
				{state ? (
					<>
						<ol>
							{state.usages.map((row) => (
								<li key={row.id}>
									<div>
										<strong>
											{items.find((i) => i.id === row.itemId)?.name}
										</strong>
										<small>
											{row.action === "equip"
												? "Equipado"
												: row.action === "unequip"
													? "Guardado"
													: row.action === "arm"
														? "Proteção ativada"
														: row.action === "protect"
															? "Dia protegido"
															: "Usado na lição"}
											{row.entryKey ? ` · questão ${row.entryKey}` : ""}
										</small>
									</div>
									<span>{date(row.createdAt)}</span>
								</li>
							))}
						</ol>
						{!state.usages.length && <p>Nenhum item usado ainda.</p>}
					</>
				) : (
					feedback
				)}
			</details>
		</section>
	);
}
