import { ResearchCard } from "@/components/cards/research-card"
import { EmptyStateImage } from "@/components/empty-states/empty-state-image"
import { ClerkQueriedUser, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, UserToStarredResearchT } from "@/src/schemas"
import { ClerkPublicUser } from "@/src/schemas"
import { UserResearchPageConfig } from "./user-research-page"

type Props = {
	tab: ReturnType<UserResearchPageConfig["getTabs"]>[number]["value"]
	user: ClerkPublicUser
	queriedUsers: ClerkQueriedUser[]
	researches: ResearchT[]
	userToStarredResearches: UserToStarredResearchT[]
	dependentValues: DependentValueT[]
	testBatches: TestBatchT[]
	testBatchResults: TestBatchResultT[]
}

export const UserResearchTabPage = (props: Props) => {
	if (props.researches.length) {
		return props.researches.map(research => {
			const currentUser = props.queriedUsers.find(u => u.id === research.userId)
			const userToStarredResearch = props.userToStarredResearches.find(utsr => utsr.researchId === research.id)
			const dependentValues = props.dependentValues.filter(dVal => dVal.researchId === research.id)
			const testBatches = props.testBatches.filter(tb => tb.researchId === research.id)
			const testBatchIds = testBatches.map(tb => tb.id)
			const testBatchResults = props.testBatchResults.filter(tbr => testBatchIds.includes(tbr.testBatchId))

			return (
				<ResearchCard
					key={research.id}
					user={props.user}
					currentUser={currentUser}
					research={research}
					userToStarredResearch={userToStarredResearch}
					dependentValues={dependentValues}
					testBatchResults={testBatchResults}
				/>
			)
		})
	} else {
		return <EmptyStateImage title={["No", ...(props.tab !== "All" ? [props.tab] : []), "Research"].join(" ")} src="/thiings/empty-beaker.webp" alt="Empty beaker" />
	}
}
