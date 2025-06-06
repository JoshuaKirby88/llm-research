import { ResearchCard } from "@/components/cards/research-card"
import { EmptyStateImage } from "@/components/empty-states/empty-state-image"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/schemas"
import { userContributionPageQuery } from "../../_queries/user-contribution-page-query"

export const ContributionPage = (props: { params: NextParam<"currentUserId">; user: ClerkPublicUser; queriedUsers: ClerkQueriedUser[] } & Return<typeof userContributionPageQuery>) => {
	if (props.researches.length) {
		return props.researches.map(research => {
			const currentUser = props.queriedUsers.find(u => u.id === research.userId)
			const userToStarredResearch = props.userToStarredResearches.find(utsr => utsr.researchId === research.id)
			const filteredDependentValues = props.dependentValues.filter(dVal => dVal.researchId === research.id)
			const filteredTestBatches = props.testBatches.filter(tb => tb.researchId === research.id)
			const testBatchIds = filteredTestBatches.map(tb => tb.id)
			const filteredTestBatchResults = props.testBatchResults.filter(tbr => testBatchIds.includes(tbr.testBatchId))

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
	} else {
		return <EmptyStateImage title="No Contributions" description="You can contribute by running tests on other's research you are interested in!" src="/thiings/empty-gift.webp" alt="Gift" />
	}
}
