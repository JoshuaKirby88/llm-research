"use server"

import { ResearchRepo } from "@/src/repos"
import { researchSchema } from "@/src/schemas"
import { AIService } from "@/src/services/ai.service"
import { ResearchTable } from "@/src/tables"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { after } from "next/server"

export const completeResearchAction = createAction(
	"signedIn",
	researchSchema.pick({ id: true, conclusion: true }),
)(async ({ input }) => {
	const updatedResearch = await ResearchRepo.update(input.id, { isComplete: true, conclusion: input.conclusion })

	if (ResearchTable.canVectorize(updatedResearch)) {
		after(async () => {
			const embedding = await AIService.createEmbedding({
				model: "text-embedding-3-small",
				text: ResearchTable.createEmbeddingText(updatedResearch),
			})

			await ResearchRepo.insertVector({
				id: input.id,
				values: embedding,
			})
		})
	}

	revalidatePath("/")
})
