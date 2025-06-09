import { db } from "@/drizzle/db"
import { Research, TestBatch, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkPublicUser } from "@/src/schemas"
import { ClerkService } from "@/src/services/clerk.service"
import { destructureArray } from "@/utils/destructure-array"
import { mightNotExist } from "@/utils/might-not-exist"
import { and, desc, eq } from "drizzle-orm"

export const researchPageQuery = async (input: { params: NextParam<"currentUserId" | "researchId">; user: ClerkPublicUser }) => {
	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(input.params.researchId)), ResearchRepo.getPublicWhere({ user: input.user })),
		with: {
			forkedResearch: true,
			contributors: true,
			userToStarredResearches: input.user.userId ? { where: eq(UserToStarredResearch.userId, input.user.userId) } : { limit: 0 },
			independentVariable: {
				with: { independentValues: true },
			},
			blockingVariables: {
				with: { blockingValues: true },
			},
			messageTemplates: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				with: {
					testModelBatches: {
						with: { testModelBatchResults: true },
					},
					testBatchResults: true,
				},
				orderBy: desc(TestBatch.id),
			},
		},
	})

	if (!result) {
		return {}
	}

	const [
		[research],
		{
			forkedResearch: forkedResearches,
			contributors,
			userToStarredResearches,
			independentVariable: [independentVariable],
			independentValues,
			blockingVariables,
			blockingValues,
			messageTemplates,
			evalPrompt: [evalPrompt],
			dependentValues,
			testBatches,
			testModelBatches,
			testModelBatchResults,
			testBatchResults,
		},
	] = destructureArray([result], {
		forkedResearch: true,
		contributors: true,
		userToStarredResearches: true,
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
		messageTemplates: true,
		evalPrompt: true,
		dependentValues: true,
		testBatches: { testModelBatches: { testModelBatchResults: true }, testBatchResults: true },
	})

	const forkedResearch = mightNotExist(forkedResearches, { index: 0 })
	const userToStarredResearch = mightNotExist(userToStarredResearches, { index: 0 })

	const queriedUsers = await ClerkService.queryUsers(contributors.map(c => c.userId))
	const currentUser = queriedUsers.find(u => input.params.currentUserId === u.id)

	return {
		research,
		forkedResearch,
		contributors,
		userToStarredResearch,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messageTemplates,
		evalPrompt,
		dependentValues,
		testBatches,
		testModelBatches,
		testModelBatchResults,
		testBatchResults,
		queriedUsers,
		currentUser,
	}
}
