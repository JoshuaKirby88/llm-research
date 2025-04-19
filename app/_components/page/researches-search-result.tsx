import { newResearchAction } from "@/actions/research/new-research.action"
import { searchResearchAction } from "@/actions/research/search-research.action"
import { EmptyState } from "@/components/empty-state"
import { HomePageResearchCard } from "@/components/research-card"
import { Suspense } from "@/components/suspense"
import { Button } from "@/components/ui/button"
import { actionIsValid } from "@/utils/actions/action-is-valid"
import { FlaskConicalIcon, TestTubeDiagonalIcon } from "lucide-react"

export const ResearchesSearchResult = Suspense(async (props: { searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams
	const { researches, users } = await actionIsValid(searchResearchAction({ search: searchParams.search }))

	if (researches.length) {
		return (
			<div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
				{researches.map(research => {
					const user = users.find(u => u.id === research.userId)
					return <HomePageResearchCard key={research.id} research={research} user={user!} />
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
