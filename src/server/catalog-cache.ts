import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "./db";

const databaseScope = createHash("sha256")
	.update(process.env.DATABASE_URL ?? "")
	.digest("hex");

// The revision is committed with the publication, including imports from the CLI.
// Reading it per request invalidates every app instance without caching student data.
const getCatalogRevision = cache(async () => {
	const [row] = await db.$queryRaw<{ version: string }[]>`
		SELECT version::text FROM "LearningCatalogRevision" WHERE id=1`;
	if (!row) throw new Error("Versão do catálogo indisponível.");
	return row.version;
});

export async function publishedCatalogCache<T>(
	name: string,
	read: () => Promise<T>,
) {
	const revision = await getCatalogRevision();
	return unstable_cache(
		read,
		["learning-catalog-v1", databaseScope, name, revision],
		{
			revalidate: 3600,
		},
	)();
}
