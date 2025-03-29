import { searchResearchAction } from "@/actions/search-research.action"
import { startResearchAction } from "@/actions/start-research.action"
import { EmptyState } from "@/components/empty-state"
import { Suspense } from "@/components/suspense"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FlaskConicalIcon, TestTubeDiagonalIcon } from "lucide-react"

export const ResearchesSearchResult = Suspense(async (props: { searchParams: NextSearchParams }) => {
	const { search } = await props.searchParams
	const researches = await searchResearchAction({ search })

	if (researches.length) {
		return (
			<div className="mx-auto grid max-w-[70rem] grid-cols-1 gap-4 md:grid-cols-3">
				{researches.map(research => (
					<Card key={research.id} className="p-4">
						<h2 className="mb-2 font-semibold text-2xl">{research.name}</h2>
					</Card>
				))}
			</div>
		)
	} else {
		return (
			<div className="mx-auto w-full max-w-[50rem]">
				<EmptyState
					title="This research doesn't exist yet."
					description="Perform your own research by clicking this button."
					icons={[<TestTubeDiagonalIcon className="-scale-x-100" />, <FlaskConicalIcon />, <TestTubeDiagonalIcon />]}
					button={
						<form action={startResearchAction}>
							<Button type="submit">Start Research</Button>
						</form>
					}
				/>
			</div>
		)
	}
})
