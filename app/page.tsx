import { newResearchAction } from "@/actions/research/new-research.action"
import { FormActionButton } from "@/components/form/server/form-action-button"
import Image from "next/image"
import { ResearchSearchForm } from "./_components/page/research-search-form"
import { ResearchSearchResult } from "./_components/page/research-search-result"

const Page = (props: { searchParams: Promise<NextSearchParam> }) => (
	<>
		<div className="mb-20 flex flex-col items-center gap-5">
			<div className="flex items-center">
				<Image src="/thiings/exploding-beaker.webp" width={100} height={100} alt="Exploding Beaker" />
				<h1 className="font-bold text-6xl">LLM Research</h1>
			</div>

			<FormActionButton action={newResearchAction} size="lg">
				New Research
			</FormActionButton>
		</div>

		<ResearchSearchForm searchParams={props.searchParams} />

		<ResearchSearchResult searchParams={props.searchParams} />
	</>
)

export default Page
