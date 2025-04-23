import { queryResearchAction } from "@/actions/research/query-research.action"
import { TestBatchCard } from "@/components/cards/test-batch-card"
import { ClerkUser } from "@/src/services/clerk.service"
import { ActionO } from "@/utils/actions/create-action"

export const TestRunTabPage = async (props: { tab: "all" | "yours" | "external"; user: ClerkUser } & NonNullable<RequiredObj<ActionO<typeof queryResearchAction>>>) => {
	const userContributor = props.contributors.find(c => c.userId === props.user.userId)
	const testBatches = props.testBatches.filter(
		tb => props.tab === "all" || (props.tab === "yours" && tb.contributorId === userContributor?.id) || (props.tab === "external" && tb.contributorId !== userContributor?.id),
	)

	return testBatches.map(testBatch => {
		const contributor = props.contributors.find(c => c.researchId === testBatch.researchId)
		const user = props.users.find(user => user.id === contributor?.userId)
		const testModelBatches = props.testModelBatches.filter(tmb => tmb.testBatchId === testBatch.id)

		return <TestBatchCard key={testBatch.id} user={user} testBatch={testBatch} testModelBatches={testModelBatches} />
	})
}
