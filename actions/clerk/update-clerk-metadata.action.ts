"use server"

import { clerkMetadataSchema } from "@/src/schemas"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"

export const updateClerkMetadataAction = createAction(
	"signedIn",
	clerkMetadataSchema,
)(async ({ user, input }) => {
	await ClerkService.updateMetadata(user.userId, input)

	revalidatePath("/")
})
