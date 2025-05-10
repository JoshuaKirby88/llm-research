import { TestBatchCard } from "@/components/cards/test-batch-card"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"

type Props = {
	queriedUsers: ClerkQueriedUser[]
	research: ResearchT
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const TestRunTabPage = (props: Props) => {
	return props.testBatches.map(testBatch => {
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
