"use server"

import { ResearchRepo } from "@/src/repos"
import { ResearchVectorRepo } from "@/src/repos/research-vector.repo"
import { researchSchema } from "@/src/schemas"
import { AIService } from "@/src/services/ai.service"
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
			await ResearchVectorRepo.delete([input.researchId])
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

			await ResearchVectorRepo.insert({
				id: input.researchId,
				values: embedding,
			})
		})
	}

	revalidatePath("/")
})
