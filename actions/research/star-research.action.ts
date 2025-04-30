"use server"

import { Research } from "@/drizzle/schema"
import { transaction } from "@/drizzle/transaction"
import { ResearchRepo } from "@/src/repos"
import { UserToStarredResearchRepo } from "@/src/repos"
import { researchSchema } from "@/src/schemas"
import { DrizzleService } from "@/src/services/drizzle.service"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const starResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id, researchUserId: researchSchema.shape.userId }),
)(async ({ user, input }) => {
	await UserToStarredResearchRepo.insert({ userId: user.userId, researchId: input.researchId })

	await transaction(async () => {
		await ResearchRepo.update(input.researchId, {
			starCount: DrizzleService.increment(Research.starCount, 1),
			isStarred: user.userId === input.researchUserId ? true : undefined,
		})
	}).onError(async () => {
		await UserToStarredResearchRepo.delete({ userId: user.userId, researchId: input.researchId })
	})

	revalidatePath("/")
})

export const unstarResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id, researchUserId: researchSchema.shape.userId }),
)(async ({ user, input }) => {
	await UserToStarredResearchRepo.delete({ userId: user.userId, researchId: input.researchId })

	await transaction(async () => {
		await ResearchRepo.update(input.researchId, {
			starCount: DrizzleService.increment(Research.starCount, -1),
			isStarred: user.userId === input.researchUserId ? false : undefined,
		})
	}).onError(async () => {
		await UserToStarredResearchRepo.insert({ userId: user.userId, researchId: input.researchId })
	})

	revalidatePath("/")
})
