import { newResearchAction } from "@/actions/research/new-research.action"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { ResearchSearchForm } from "./_components/page/research-search-form"
import { ResearchSearchResult } from "./_components/page/research-search-result"

const Page = (props: { searchParams: NextSearchParams }) => (
	<>
		<h1 className="font-bold text-6xl">LLM Research</h1>

		<FormActionButton action={newResearchAction} size="lg">
			New Research
		</FormActionButton>

		<ResearchSearchForm searchParams={props.searchParams} />

		<ResearchSearchResult searchParams={props.searchParams} />
	</>
)

export default Page
