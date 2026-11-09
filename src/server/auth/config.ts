import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

const googleProvider =
	env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
		? Google({
				clientId: env.AUTH_GOOGLE_ID,
				clientSecret: env.AUTH_GOOGLE_SECRET,
			})
		: null;

export const isGoogleConfigured = googleProvider !== null;

export const authConfig = {
	providers: googleProvider ? [googleProvider] : [],
	pages: {
		signIn: "/login",
		error: "/login",
	},
	adapter: PrismaAdapter(db),
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
} satisfies NextAuthConfig;
