import { TestBatchCard } from "@/components/cards/test-batch-card"
import { EmptyStateImage } from "@/components/empty-states/empty-state-image"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/schemas"
import { TestRunPageConfig } from "../test-run-page"

type Props = {
	tab: TestRunPageConfig["tabs"][number]["value"]
	queriedUsers: ClerkQueriedUser[]
	research: ResearchT
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const TestRunTabPage = (props: Props) => {
	if (props.testBatches.length) {
		return props.testBatches.map(testBatch => {
			const currentTestBatchContributor = props.contributors.find(c => c.id === testBatch.contributorId)!
			const currentUser = props.queriedUsers.find(queriedUser => queriedUser.id === currentTestBatchContributor.userId)
			const testModelBatches = props.testModelBatches.filter(tmb => tmb.testBatchId === testBatch.id)
			const testBatchResults = props.testBatchResults.filter(tbr => tbr.testBatchId === testBatch.id)

			return (
				<TestBatchCard
					key={testBatch.id}
					research={props.research}
					currentUser={currentUser}
					testBatch={testBatch}
					testModelBatches={testModelBatches}
					dependentValues={props.dependentValues}
					testBatchResults={testBatchResults}
				/>
			)
		})
	} else {
		return <EmptyStateImage title={["No", ...(props.tab !== "All" ? [props.tab] : []), "Test Runs"].join(" ")} src="/thiings/experiment-tube.webp" alt="Experiment tube" />
	}
}
