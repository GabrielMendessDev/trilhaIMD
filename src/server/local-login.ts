import "server-only";

export function localLoginEnabled() {
	if (
		process.env.NODE_ENV !== "development" ||
		process.env.TRILBIT_LOCAL_LOGIN !== "true"
	)
		return false;
	try {
		return ["localhost", "127.0.0.1", "[::1]"].includes(
			new URL(process.env.DATABASE_URL ?? "").hostname,
		);
	} catch {
		return false;
	}
}
