"use server"

import { ResearchRepo } from "@/src/repos"
import { ResearchVectorRepo } from "@/src/repos/research-vector.repo"
import { updateResearchAndVectorSchema } from "@/src/schemas"
import { MyAIService } from "@/src/services/ai.service"
import { ResearchTable } from "@/src/tables"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { after } from "next/server"

export const updateResearchAndVectorAction = createAction(
	"signedIn",
	updateResearchAndVectorSchema,
)(async ({ input }) => {
	const updatedResearch = await ResearchRepo.update(input.id, { name: input.name, description: input.description, conclusion: input.conclusion })

	if (ResearchTable.canVectorize(updatedResearch)) {
		after(async () => {
			const embedding = await MyAIService.createEmbedding({
				model: "text-embedding-3-small",
				text: ResearchTable.createEmbeddingText(updatedResearch),
			})

			await ResearchVectorRepo.insert({
				id: input.id,
				values: embedding,
			})
		})
	}

	revalidatePath("/")
})
