import "~/styles/globals.css";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { analyticsEnabled } from "~/server/analytics";
import { AnalyticsClient } from "./_components/analytics-client";
import { FeedbackProvider } from "./_components/feedback";

export const metadata: Metadata = {
	title: { default: "trilbit", template: "%s | trilbit" },
	description: "Aprenda TI. Evolua por trilhas.",
	icons: { icon: "/brand/trilbit-mark.svg" },
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const theme =
		(await cookies()).get("trilbit-theme")?.value === "dark"
			? "dark"
			: "light";

	return (
		<html data-theme={theme} lang="pt-BR" suppressHydrationWarning>
			<body>
				<FeedbackProvider>{children}</FeedbackProvider>
				{analyticsEnabled() && <AnalyticsClient />}
			</body>
		</html>
	);
}
