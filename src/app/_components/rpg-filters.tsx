import { useEffect, useState } from "react";
import { categoryNames, rarityNames } from "~/domain/rpg";
import { readTabValue, writeTabValue } from "./tab-storage";

export const itemCategories = {
	todos: "Todos",
	auxilio: "Auxílio",
	consumiveis: "Consumíveis",
	ofensiva: "Ofensiva",
	cosmeticos: "Cosméticos",
	especiais: "Especiais",
};
const defaults = { category: "todos", rarity: "todos", status: "todos" };

export function useRpgFilters(mode: "shop" | "inventory" | "achievements") {
	const storageKey = `trilbit:rpg-filters:v1:${mode}`;
	const [filters, setFilters] = useState(defaults);
	useEffect(() => {
		const stored = readTabValue(storageKey);
		if (!stored || typeof stored !== "object") {
			setFilters(defaults);
			return;
		}
		const { category, rarity, status } = stored as Partial<typeof defaults>;
		const categories = mode === "achievements" ? categoryNames : itemCategories;
		setFilters({
			category:
				typeof category === "string" && Object.hasOwn(categories, category)
					? category
					: "todos",
			rarity:
				typeof rarity === "string" && Object.hasOwn(rarityNames, rarity)
					? rarity
					: "todos",
			status: status === "earned" || status === "locked" ? status : "todos",
		});
	}, [storageKey, mode]);
	const change = (field: keyof typeof defaults, value: string) => {
		const next = { ...filters, [field]: value };
		setFilters(next);
		writeTabValue(storageKey, next);
	};
	return { ...filters, change };
}

export function RpgFilters({
	mode,
	count,
	filters,
}: {
	mode: Parameters<typeof useRpgFilters>[0];
	count: number;
	filters: ReturnType<typeof useRpgFilters>;
}) {
	const { category, rarity, status, change } = filters;
	return (
		<fieldset aria-label="Filtros do catálogo" className="rpg-filters">
			<label>
				Categoria
				<select
					onChange={(e) => change("category", e.target.value)}
					value={category}
				>
					{Object.entries(
						mode === "achievements"
							? { todos: "Todas", ...categoryNames }
							: itemCategories,
					).map(([key, label]) => (
						<option key={key} value={key}>
							{label}
						</option>
					))}
				</select>
			</label>
			<label>
				Raridade
				<select
					onChange={(e) => change("rarity", e.target.value)}
					value={rarity}
				>
					<option value="todos">Todas</option>
					{Object.entries(rarityNames).map(([key, label]) => (
						<option key={key} value={key}>
							{label}
						</option>
					))}
				</select>
			</label>
			{mode === "achievements" && (
				<label>
					Estado
					<select
						onChange={(e) => change("status", e.target.value)}
						value={status}
					>
						<option value="todos">Todas</option>
						<option value="earned">Desbloqueadas</option>
						<option value="locked">Bloqueadas</option>
					</select>
				</label>
			)}
			<span>
				{count} {mode === "achievements" ? "conquistas" : "itens"}
			</span>
		</fieldset>
	);
}
