import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkPublicUser } from "@/src/schemas"
import { destructureArray } from "@/utils/destructure-array"
import { and, desc, eq } from "drizzle-orm"

export const userResearchPageQuery = async (input: { params: NextParam<"currentUserId">; user: ClerkPublicUser }) => {
	const result = await db.query.Research.findMany({
		where: and(eq(Research.userId, input.params.currentUserId), ResearchRepo.getPublicWhere({ userId: input.user.userId })),
		with: {
			userToStarredResearches: input.user.userId ? { where: eq(UserToStarredResearch.userId, input.user.userId) } : { limit: 0 },
			dependentValues: true,
			testBatches: {
				with: { testBatchResults: true },
			},
		},
		orderBy: desc(Research.id),
	})

	const [researches, { userToStarredResearches, dependentValues, testBatches, testBatchResults }] = destructureArray(result, {
		userToStarredResearches: true,
		dependentValues: true,
		testBatches: { testBatchResults: true },
	})

	return {
		researches,
		userToStarredResearches,
		dependentValues,
		testBatches,
		testBatchResults,
	}
}
