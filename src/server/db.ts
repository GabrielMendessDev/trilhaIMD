import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

// The pg driver sends each query in a single round trip, even through the
// Supabase transaction pooler. Prisma's own engine with `pgbouncer=true` needs
// several round trips per query, and `connection_limit=1` serialized every
// query in a request. The Prisma-only URL options do not apply to pg.
function connectionString(url: string) {
	const parsed = new URL(url);
	for (const option of ["pgbouncer", "connection_limit", "pool_timeout"])
		parsed.searchParams.delete(option);
	return parsed.toString();
}

const createPrismaClient = () =>
	new PrismaClient({
		adapter: new PrismaPg({
			connectionString: connectionString(env.DATABASE_URL),
			max: 5,
			idleTimeoutMillis: 30_000,
		}),
		log:
			env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
