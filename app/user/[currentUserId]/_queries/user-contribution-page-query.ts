import { db } from "@/drizzle/db"
import { Contributor, UserToStarredResearch } from "@/drizzle/schema"
import { ClerkPublicUser } from "@/src/schemas"
import { destructureArray } from "@/utils/destructure-array"
import { and, desc, eq } from "drizzle-orm"

export const userContributionPageQuery = async (input: { params: NextParam<"currentUserId">; user: ClerkPublicUser }) => {
	const result = await db.query.Contributor.findMany({
		where: and(eq(Contributor.userId, input.params.currentUserId), eq(Contributor.isOwner, false)),
		with: {
			research: {
				with: {
					userToStarredResearches: input.user.userId ? { where: eq(UserToStarredResearch.userId, input.user.userId) } : { limit: 0 },
					dependentValues: true,
					testBatches: {
						with: {
							testBatchResults: true,
						},
					},
				},
			},
		},
		orderBy: desc(Contributor.id),
	})

	const [contributors, { research: researches, userToStarredResearches, dependentValues, testBatches, testBatchResults }] = destructureArray(result, {
		research: { userToStarredResearches: true, dependentValues: true, testBatches: { testBatchResults: true } },
	})

	return {
		contributors,
		researches,
		userToStarredResearches,
		dependentValues,
		testBatches,
		testBatchResults,
	}
}
