import type { RpgHistoryData } from "~/server/rpg-history";

const freshnessMs = 30_000;
type Snapshot = {
	account: string;
	expires: number;
	request: Promise<RpgHistoryData>;
};
let snapshot: Snapshot | undefined;

export function invalidateRpgHistory() {
	snapshot = undefined;
}

export function loadRpgHistory(account: string) {
	if (snapshot?.account === account && snapshot.expires > Date.now())
		return snapshot.request;
	const request: Promise<RpgHistoryData> = fetch("/api/rpg?history=1", {
		cache: "no-store",
		signal: AbortSignal.timeout(15000),
	}).then(async (response) => {
		if (!response.ok)
			throw new Error("Não foi possível consultar o histórico.");
		const result: RpgHistoryData & { account: string } = await response.json();
		if (result.account !== account) throw new Error("A sessão da conta mudou.");
		return { history: result.history, usages: result.usages };
	});
	const current = { account, expires: Infinity, request };
	snapshot = current;
	void request.then(
		() => {
			current.expires = Date.now() + freshnessMs;
		},
		() => {
			if (snapshot === current) invalidateRpgHistory();
		},
	);
	return request;
}
