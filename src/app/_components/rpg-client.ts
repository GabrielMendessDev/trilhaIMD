"use client";
import type { RpgState, rpgBalance } from "~/server/rpg";
export type RpgBalance = ReturnType<typeof rpgBalance>;
export function publishRpg(
	state: RpgState | RpgBalance,
	awards?: RpgBalance["awards"],
) {
	const balance = {
		...state,
		streak: "stats" in state ? state.stats.studyStreak : state.streak,
		protected:
			"protections" in state
				? state.protections.some((p) => p.state === "armed")
				: state.protected,
		awards: awards ?? ("awards" in state ? state.awards : []),
	};
	window.dispatchEvent(new CustomEvent("trilbit:rpg", { detail: balance }));
}
export async function rpgRequest<T>(
	body: Record<string, unknown>,
	signal?: AbortSignal,
): Promise<T> {
	const response = await fetch("/api/rpg", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		signal: signal ?? AbortSignal.timeout(20000),
	});
	const result = await response.json();
	if (!response.ok)
		throw new Error(
			result.error ?? "Não foi possível confirmar. Tente novamente.",
		);
	return result as T;
}
