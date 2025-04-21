import { deleteAccountAction } from "@/actions/account/delete-account.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { Dialog } from "@/components/dialog"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { IconWrapper } from "@/components/icon-wrapper"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TriangleAlertIcon } from "lucide-react"

export const AccountPage = () => {
	return (
		<div className="space-y-10">
			<Separator />

			<AlertCard>
				<IconWrapper>
					<TriangleAlertIcon />
				</IconWrapper>
				<AlertCardContent title="Permanently Delete Account" description="Delete your account, alongside all your data.">
					<Dialog
						icon={<TriangleAlertIcon />}
						title="Are you sure?"
						description="Deleting your account will permanently remove all your personal data, except for any collaborative research contributions."
						triggerButton={<Button variant="red">Delete Account</Button>}
						cancelProps={{ children: "Cancel" }}
						confirmButton={
							<FormActionButton variant="red" action={deleteAccountAction} className="w-full">
								Delete Account
							</FormActionButton>
						}
					/>
				</AlertCardContent>
			</AlertCard>
		</div>
	)
}
