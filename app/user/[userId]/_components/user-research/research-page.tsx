import { ResearchCard } from "@/components/cards/research-card"
import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { desc, eq } from "drizzle-orm"
import { userResearchPageConfig } from "./user-research-page"

export const ResearchPage = Suspense(async (props: { tab: (typeof userResearchPageConfig)["tabs"][number]["value"] }) => {
	const user = await authProcedure("signedIn")

	const result = await db.query.Research.findMany({
		where: DrizzleService.where(Research, {
			userId: user.userId,
			isArchived: false,
			...(props.tab === "All" ? {} : props.tab === "Starred" ? { isStarred: true } : props.tab === "Archived" ? { isArchived: true } : { isComplete: props.tab === "Complete" }),
		}),
		with: {
			userToStarredResearches: {
				where: eq(UserToStarredResearch.userId, user.userId),
			},
			dependentValues: true,
			testBatches: {
				with: { testBatchResults: true },
			},
		},
		orderBy: desc(Research.id),
	})

	const [researches, { userToStarredResearches, dependentValues, testBatches: testBatchesWithResults }] = destructureArray(result, {
		userToStarredResearches: true,
		dependentValues: true,
		testBatches: true,
	})

	return researches.map(research => {
		const userToStarredResearch = userToStarredResearches.find(utsr => utsr.researchId === research.id)
		const filteredDependentValues = dependentValues.filter(dv => dv.researchId === research.id)
		const filteredTestBatchResults = testBatchesWithResults.filter(tb => tb.researchId === research.id).flatMap(tb => tb.testBatchResults)

		return (
			<ResearchCard key={research.id} research={research} userToStarredResearch={userToStarredResearch} dependentValues={filteredDependentValues} testBatchResults={filteredTestBatchResults} />
		)
	})
})
