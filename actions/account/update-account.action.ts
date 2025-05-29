"use server"

import { AccountRepo } from "@/src/repos/account.repo"
import { updateAccountSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"

export const updateAccountAction = createAction(
	"signedIn",
	updateAccountSchema.omit({ userId: true }),
)(async ({ user, input }) => {
	await AccountRepo.update(user.userId, input)

	revalidatePath("/")
})
