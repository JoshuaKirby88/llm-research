import { ResearchCard } from "@/components/cards/research-card"
import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Contributor, UserToStarredResearch } from "@/drizzle/schema"
import { ClerkPublicUser } from "@/src/schemas"
import { ClerkService } from "@/src/services/clerk.service"
import { destructureArray } from "@/utils/destructure-array"
import { and, eq } from "drizzle-orm"

export const ContributionPage = Suspense(async (props: { params: NextParam<"currentUserId">; user: ClerkPublicUser }) => {
	const result = await db.query.Contributor.findMany({
		where: and(eq(Contributor.userId, props.params.currentUserId), eq(Contributor.isOwner, false)),
		with: {
			research: {
				with: {
					userToStarredResearches: props.user.userId ? { where: eq(UserToStarredResearch.userId, props.user.userId) } : { limit: 0 },
					dependentValues: true,
					testBatches: {
						with: {
							testBatchResults: true,
						},
					},
				},
			},
		},
	})

	const [contributors, { research: researches, userToStarredResearches, dependentValues, testBatches, testBatchResults }] = destructureArray(result, {
		research: { userToStarredResearches: true, dependentValues: true, testBatches: { testBatchResults: true } },
	})

	const queriedUsers = await ClerkService.queryUsers(researches.map(r => r.userId))

	return researches.map(research => {
		const currentUser = queriedUsers.find(u => u.id === research.userId)
		const userToStarredResearch = userToStarredResearches.find(utsr => utsr.researchId === research.id)
		const filteredDependentValues = dependentValues.filter(dVal => dVal.researchId === research.id)
		const filteredTestBatches = testBatches.filter(tb => tb.researchId === research.id)
		const testBatchIds = filteredTestBatches.map(tb => tb.id)
		const filteredTestBatchResults = testBatchResults.filter(tbr => testBatchIds.includes(tbr.testBatchId))

		return (
			<ResearchCard
				key={research.id}
				user={props.user}
				currentUser={currentUser}
				research={research}
				userToStarredResearch={userToStarredResearch}
				dependentValues={filteredDependentValues}
				testBatchResults={filteredTestBatchResults}
			/>
		)
	})
})
