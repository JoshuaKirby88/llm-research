"use server"
import { APIKeyRepo } from "@/src/repos"
import { updateAPIKeySchema } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables/api-key.table"
import { createAction } from "@/utils/actions/create-action"

export const saveAPIKeyAction = createAction(
	"signedIn",
	updateAPIKeySchema.omit({ userId: true }),
)(async ({ user, input }) => {
	const filteredAPIKey: typeof input = Object.fromEntries(Object.entries(input).filter(([_, value]) => value))

	const encryptedAPIKey = APIKeyTable.encrypt(filteredAPIKey)

	const result = await APIKeyRepo.update(user.userId, encryptedAPIKey)

	return result
})
