import "~/styles/globals.css";

import type { Metadata } from "next";
import { cookies } from "next/headers";
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
		(await cookies()).get("trilbit-theme")?.value === "light"
			? "light"
			: "dark";

	return (
		<html data-theme={theme} lang="pt-BR" suppressHydrationWarning>
			<body>
				<FeedbackProvider>{children}</FeedbackProvider>
			</body>
		</html>
	);
}
