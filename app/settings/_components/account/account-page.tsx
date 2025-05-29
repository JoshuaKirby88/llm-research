import { Separator } from "@/components/ui/separator"
import { AccountT } from "@/src/schemas"
import { AccountForm } from "./account-form"
import { DeleteAccountAlertCard } from "./delete-account-alert-card"

export const AccountPage = (props: { account: AccountT }) => {
	return (
		<div className="space-y-10">
			<AccountForm account={props.account} />

			<Separator />

			<DeleteAccountAlertCard />
		</div>
	)
}
