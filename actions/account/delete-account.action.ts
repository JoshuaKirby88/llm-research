"use server"

import { APIKeyRepo, ResearchRepo } from "@/src/repos"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const deleteAccountAction = createAction("signedIn")(async ({ user }) => {
	await APIKeyRepo.delete(user.userId)

	await ResearchRepo.deleteResearchAndVectorsByUserId(user.userId)

	await ClerkService.deleteUser(user.userId)

	redirect("/")
})
