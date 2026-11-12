type Question = {
	key: string;
	type: string | null;
	payload?: unknown;
};

/** Practice remains usable inside checkpoint lessons; only verification is required. */
export function isEssentialQuestion(
	entry: Question,
	pointNumber: number,
	lesson: readonly Question[],
) {
	if (entry.type === null || entry.type === "WALKTHROUGH") return false;
	const original =
		lesson.find((candidate) => candidate.key === entry.key) ?? entry;
	if ((original.payload as { essencial?: boolean } | null)?.essencial === true)
		return true;
	if (pointNumber <= 0 || pointNumber % 5 !== 0) return false;
	for (let index = lesson.length - 1; index >= 0; index--) {
		const candidate = lesson[index];
		if (
			candidate &&
			candidate.type !== null &&
			candidate.type !== "WALKTHROUGH"
		)
			return candidate.key === entry.key;
	}
	return false;
}
