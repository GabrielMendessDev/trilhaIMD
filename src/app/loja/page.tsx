import { DashboardLayout } from "~/app/_components/dashboard";
import { RpgHub } from "~/app/_components/rpg-hub";
import { auth } from "~/server/auth";
import { getRpgSummary } from "~/server/rpg";
export const metadata = { title: "Loja do Bito" };
export default async function LojaPage() {
	const user = (await auth())?.user;
	return (
		<DashboardLayout active="/loja">
			<div className="ui-page">
				<RpgHub
					initial={user ? await getRpgSummary(user.id) : null}
					key={user?.id ?? "guest"}
					mode="shop"
				/>
			</div>
		</DashboardLayout>
	);
}
