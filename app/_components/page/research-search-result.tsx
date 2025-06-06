import { newResearchAction } from "@/actions/research/new-research.action"
import { searchResearchAction } from "@/actions/research/search-research.action"
import { HomePageResearchCard } from "@/components/cards/research-card"
import { EmptyStateBox } from "@/components/empty-states/empty-state-box"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { Suspense } from "@/components/suspense"
import { resultIsValid } from "@/utils/actions/result-is-valid"
import { FlaskConicalIcon, TestTubeDiagonalIcon } from "lucide-react"

export const ResearchSearchResult = Suspense(async (props: { searchParams: Promise<NextSearchParam> }) => {
	const searchParams = await props.searchParams
	const result = await resultIsValid(searchResearchAction({ search: searchParams.search }))

	if (result.researches.length) {
		return (
			<div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
				{result.researches.map(research => {
					const currentUser = result.queriedUsers.find(queriedUser => queriedUser.id === research.userId)
					const userToStarredResearch = result.userToStarredResearches.find(utsr => utsr.researchId === research.id)
					return <HomePageResearchCard key={research.id} user={result.user} currentUser={currentUser} research={research} userToStarredResearch={userToStarredResearch} />
				})}
			</div>
		)
	} else {
		return (
			<div className="mx-auto w-full max-w-3xl">
				<EmptyStateBox
					title="This research doesn't exist yet."
					description="Perform your own research by clicking this button."
					icons={[<TestTubeDiagonalIcon className="-scale-x-100" />, <FlaskConicalIcon />, <TestTubeDiagonalIcon />]}
					button={<FormActionButton action={newResearchAction}>New Research</FormActionButton>}
				/>
			</div>
		)
	}
})
