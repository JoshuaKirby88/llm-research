import { startResearchAction } from "@/actions/start-research.action"
import { FormActionButton } from "@/components/form-action-button"
import { ResearchesSearchForm } from "./_components/page/researches-search-form"
import { ResearchesSearchResult } from "./_components/page/researches-search-result"

const Page = (props: { searchParams: NextSearchParams }) => (
	<>
		<h1 className="font-bold text-6xl">LLM Research</h1>

		<FormActionButton action={startResearchAction} size="lg">
			Start Research
		</FormActionButton>

		<ResearchesSearchForm searchParams={props.searchParams} />

		<ResearchesSearchResult searchParams={props.searchParams} />
	</>
)

export default Page
