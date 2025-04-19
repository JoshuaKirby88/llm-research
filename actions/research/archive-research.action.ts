"use server"

import { ResearchRepo } from "@/src/repos"
import { researchSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const archiveResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ input }) => {
	await ResearchRepo.update(input.researchId, { isArchived: true })

	revalidatePath("/")
})

export const unarchiveResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ input }) => {
	await ResearchRepo.update(input.researchId, { isArchived: false })

	revalidatePath("/")
})
