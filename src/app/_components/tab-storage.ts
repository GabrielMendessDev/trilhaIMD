export function readTabValue(key: string): unknown {
	try {
		const value = window.sessionStorage.getItem(key);
		return value === null ? undefined : JSON.parse(value);
	} catch {
		return undefined;
	}
}

export function writeTabValue(key: string, value: unknown) {
	try {
		window.sessionStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be disabled or full. The interface still works in memory.
	}
}
