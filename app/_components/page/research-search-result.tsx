import { newResearchAction } from "@/actions/research/new-research.action"
import { searchResearchAction } from "@/actions/research/search-research.action"
import { HomePageResearchCard } from "@/components/cards/research-card"
import { EmptyState } from "@/components/empty-state"
import { Suspense } from "@/components/suspense"
import { Button } from "@/components/ui/button"
import { resultIsValid } from "@/utils/actions/result-is-valid"
import { FlaskConicalIcon, TestTubeDiagonalIcon } from "lucide-react"

export const ResearchSearchResult = Suspense(async (props: { searchParams: Promise<NextSearchParam> }) => {
	const searchParams = await props.searchParams
	const { queriedUsers, researches, userToStarredResearches } = await resultIsValid(searchResearchAction({ search: searchParams.search }))

	if (researches.length) {
		return (
			<div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
				{researches.map(research => {
					const currentUser = queriedUsers.find(queriedUser => queriedUser.id === research.userId)
					const userToStarredResearch = userToStarredResearches.find(utsr => utsr.researchId === research.id)
					return <HomePageResearchCard key={research.id} currentUser={currentUser} research={research} userToStarredResearch={userToStarredResearch} />
				})}
			</div>
		)
	} else {
		return (
			<div className="mx-auto w-full max-w-3xl">
				<EmptyState
					title="This research doesn't exist yet."
					description="Perform your own research by clicking this button."
					icons={[<TestTubeDiagonalIcon className="-scale-x-100" />, <FlaskConicalIcon />, <TestTubeDiagonalIcon />]}
					button={
						<form action={newResearchAction as any}>
							<Button type="submit">New Research</Button>
						</form>
					}
				/>
			</div>
		)
	}
})
