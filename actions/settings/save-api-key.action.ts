"use server"

import { APIKeyRepo } from "@/src/repos"
import { updateAPIKeySchema } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables/api-key.table"
import { createAction } from "@/utils/actions/create-action"

export const saveAPIKeyAction = createAction(
	"signedIn",
	updateAPIKeySchema.omit({ userId: true }),
)(async ({ user, input }) => {
	const encryptedAPIKey = APIKeyTable.encrypt(input)

	const updatedAPIKey = await APIKeyRepo.update(user.userId, encryptedAPIKey)

	const maskedUpdatedAPIKey = APIKeyTable.mask(APIKeyTable.decrypt(updatedAPIKey))

	return {
		maskedUpdatedAPIKey,
	}
})
