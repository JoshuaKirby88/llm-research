import { ResearchCard } from "@/components/cards/research-card"
import { Suspense } from "@/components/suspense"
import { DependentValueT, ResearchT, TestBatchResultT, TestBatchT, UserToStarredResearchT } from "@/src/schemas"
import { ClerkPublicUser } from "@/src/services/clerk.service"

type Props = {
	user: ClerkPublicUser
	researches: ResearchT[]
	userToStarredResearches: UserToStarredResearchT[]
	dependentValues: DependentValueT[]
	testBatches: TestBatchT[]
	testBatchResults: TestBatchResultT[]
}

export const ResearchPage = Suspense(async (props: Props) => {
	return props.researches.map(research => {
		const userToStarredResearch = props.userToStarredResearches.find(utsr => utsr.researchId === research.id)
		const dependentValues = props.dependentValues.filter(dVal => dVal.researchId === research.id)
		const testBatches = props.testBatches.filter(tb => tb.researchId === research.id)
		const testBatchIds = testBatches.map(tb => tb.id)
		const testBatchResults = props.testBatchResults.filter(tbr => testBatchIds.includes(tbr.testBatchId))

		return (
			<ResearchCard key={research.id} user={props.user} research={research} userToStarredResearch={userToStarredResearch} dependentValues={dependentValues} testBatchResults={testBatchResults} />
		)
	})
})
