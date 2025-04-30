import { TestBatchCard } from "@/components/cards/test-batch-card"
import { ContributorT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkUser } from "@/src/services/clerk.service"
import { User } from "@clerk/nextjs/server"

type Props = {
	tab: "all" | "yours" | "contributions"
	user: ClerkUser
	users: User[]
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
}

export const TestRunTabPage = async (props: Props) => {
	const userContributor = props.contributors.find(c => c.userId === props.user.userId)
	const testBatches = props.testBatches.filter(
		tb => props.tab === "all" || (props.tab === "yours" && tb.contributorId === userContributor?.id) || (props.tab === "contributions" && tb.contributorId !== userContributor?.id),
	)

	return testBatches.map(testBatch => {
		const contributor = props.contributors.find(c => c.researchId === testBatch.researchId)
		const user = props.users.find(user => user.id === contributor?.userId)
		const testModelBatches = props.testModelBatches.filter(tmb => tmb.testBatchId === testBatch.id)

		return <TestBatchCard key={testBatch.id} user={user} testBatch={testBatch} testModelBatches={testModelBatches} />
	})
}
