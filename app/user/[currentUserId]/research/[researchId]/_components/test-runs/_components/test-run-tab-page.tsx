import { TestBatchCard } from "@/components/cards/test-batch-card"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/services/clerk.service"
import { TestRunTabId } from "../test-run-page"

type Props = {
	tab: TestRunTabId
	user: ClerkPublicUser
	queriedUsers: ClerkQueriedUser[]
	research: ResearchT
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const TestRunTabPage = async (props: Props) => {
	const currentContributor = props.contributors.find(c => c.userId === props.research.userId)!
	const testBatches = props.testBatches.filter(
		tb => props.tab === "All" || (props.tab === "Own" && tb.contributorId === currentContributor.id) || (props.tab === "Contributions" && tb.contributorId !== currentContributor.id),
	)

	return testBatches.map(testBatch => {
		const currentTestBatchContributor = props.contributors.find(c => c.id === testBatch.contributorId)!
		const currentUser = props.queriedUsers.find(queriedUser => queriedUser.id === currentTestBatchContributor.userId)
		const testModelBatches = props.testModelBatches.filter(tmb => tmb.testBatchId === testBatch.id)

		return (
			<TestBatchCard
				key={testBatch.id}
				research={props.research}
				currentUser={currentUser}
				testBatch={testBatch}
				testModelBatches={testModelBatches}
				dependentValues={props.dependentValues}
				testBatchResults={props.testBatchResults}
			/>
		)
	})
}
