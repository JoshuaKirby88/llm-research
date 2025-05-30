import { updateClerkMetadataAction } from "@/actions/clerk/update-clerk-metadata.action"
import { FormButton } from "@/components/form/server/form-button"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/ui/label"
import { ClerkQueriedUser } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"

export const AccountForm = (props: { currentUser: ClerkQueriedUser }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(updateClerkMetadataAction, { formData })
	}

	return (
		<form className="space-y-3" action={onSubmit}>
			<Label size="xl" className="mb-1">
				Bio
			</Label>
			<Textarea name="bio" defaultValue={props.currentUser.metadata.bio} />

			<FormButton>Save</FormButton>
		</form>
	)
}
