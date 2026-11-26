import { DashboardLayout } from "~/app/_components/dashboard";
import { RpgHub } from "~/app/_components/rpg-hub";
import { auth } from "~/server/auth";
import { readRpgInventoryState } from "~/server/rpg";
export const metadata = { title: "Mochila" };
export default async function MochilaPage() {
	const user = (await auth())?.user;
	const summary = user ? await readRpgInventoryState(user.id) : null;
	return (
		<DashboardLayout active="/mochila">
			<div className="ui-page">
				<RpgHub
					initial={summary}
					key={summary?.account ?? "guest"}
					mode="inventory"
				/>
			</div>
		</DashboardLayout>
	);
}
