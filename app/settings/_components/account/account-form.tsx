import { updateAccountAction } from "@/actions/account/update-account.action"
import { FormButton } from "@/components/form/server/form-button"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/ui/label"
import { AccountT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"

export const AccountForm = (props: { account: AccountT }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(updateAccountAction, { formData })
	}

	return (
		<form className="space-y-3" action={onSubmit}>
			<Label size="xl" className="mb-1">
				Bio
			</Label>
			<Textarea name="bio" defaultValue={props.account.bio} />

			<FormButton>Save</FormButton>
		</form>
	)
}
