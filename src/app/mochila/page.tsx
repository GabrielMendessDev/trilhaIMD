import { DashboardLayout } from "~/app/_components/dashboard";
import { RpgHub } from "~/app/_components/rpg-hub";
import { auth } from "~/server/auth";
import { getRpgState } from "~/server/rpg";
export const metadata = { title: "Mochila" };
export default async function MochilaPage() {
	const user = (await auth())?.user;
	return (
		<DashboardLayout active="/mochila">
			<div className="ui-page">
				<RpgHub
					initial={user ? await getRpgState(user.id) : null}
					mode="inventory"
				/>
			</div>
		</DashboardLayout>
	);
}
