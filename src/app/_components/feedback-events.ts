export function consumeFeedbackEvent(
	getStorage: () => Pick<Storage, "getItem" | "setItem">,
	id: string,
) {
	const key = `trilbit-feedback:${id}`;
	try {
		const storage = getStorage();
		if (storage.getItem(key)) return false;
		storage.setItem(key, "seen");
		return true;
	} catch {
		return false;
	}
}
