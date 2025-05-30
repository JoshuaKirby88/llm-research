import { Separator } from "@/components/ui/separator"
import { ClerkQueriedUser } from "@/src/schemas"
import { AccountForm } from "./account-form"
import { DeleteAccountAlertCard } from "./delete-account-alert-card"

export const AccountPage = (props: { currentUser: ClerkQueriedUser }) => {
	return (
		<div className="space-y-10">
			<AccountForm currentUser={props.currentUser} />

			<Separator />

			<DeleteAccountAlertCard />
		</div>
	)
}
