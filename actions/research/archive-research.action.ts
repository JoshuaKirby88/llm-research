"use server"

import { ResearchRepo } from "@/src/repos"
import { researchSchema } from "@/src/schemas"
import { AIService } from "@/src/services"
import { ResearchTable } from "@/src/tables"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"

export const archiveResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ input }) => {
	const updatedResearch = await ResearchRepo.update(input.researchId, { isArchived: true })

	if (ResearchTable.canDeleteVector(updatedResearch)) {
		after(async () => {
			await ResearchRepo.deleteVectors([input.researchId])
		})
	}

	revalidatePath("/")
})

export const unarchiveResearchAction = createAction(
	"signedIn",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ input }) => {
	const updatedResearch = await ResearchRepo.update(input.researchId, { isArchived: false })

	if (ResearchTable.canVectorize(updatedResearch)) {
		after(async () => {
			const embedding = await AIService.createEmbedding({
				model: "text-embedding-3-small",
				text: ResearchTable.createEmbeddingText(updatedResearch),
			})

			await ResearchRepo.insertVector({
				id: input.researchId,
				values: embedding,
			})
		})
	}

	revalidatePath("/")
})
