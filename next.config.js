/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	distDir: process.env.TRILBIT_NEXT_DIST_DIR || ".next",
	images: {
		// Google profile photos are served through the Next.js image optimizer.
		// Browsers that hotlink lh3.googleusercontent.com repeatedly get
		// 429 Too Many Requests and show a broken image.
		remotePatterns: [
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
		],
		minimumCacheTTL: 86_400,
	},
};

export default config;
