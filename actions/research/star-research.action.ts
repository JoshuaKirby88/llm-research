"use server"

import { Research } from "@/drizzle/schema"
import { transaction } from "@/drizzle/transaction"
import { ResearchRepo } from "@/src/repos"
import { UserToStarredResearchRepo } from "@/src/repos/user-to-starred-research.repo"
import { researchSchema } from "@/src/schemas"
import { DrizzleService } from "@/src/services/drizzle.service"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const starResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ user, input }) => {
	await transaction(async tx => {
		await UserToStarredResearchRepo.insert({ userId: user.userId, researchId: input.researchId }, tx)

		await ResearchRepo.update(input.researchId, { stars: DrizzleService.increment(Research.stars, 1) }, tx)
	})

	revalidatePath("/")
})

export const unstarResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ user, input }) => {
	await transaction(async tx => {
		await UserToStarredResearchRepo.delete({ userId: user.userId, researchId: input.researchId }, tx)

		await ResearchRepo.update(input.researchId, { stars: DrizzleService.increment(Research.stars, -1) }, tx)
	})

	revalidatePath("/")
})
