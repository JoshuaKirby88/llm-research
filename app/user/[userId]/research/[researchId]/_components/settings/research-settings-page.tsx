import { Separator } from "@/components/ui/separator"
import { ResearchT, TestBatchT } from "@/src/schemas"
import { ArchiveResearchCard } from "./archive-research-card"
import { CompleteResearchCard } from "./complete-research-card"
import { ResearchNameAndDescriptionAndConclusionForm } from "./research-name-and-description-and-conclusion-form"

export const ResearchSettingsPage = (props: { research: ResearchT; testBatches: TestBatchT[] }) => {
	return (
		<div className="flex flex-col gap-10">
			<ResearchNameAndDescriptionAndConclusionForm research={props.research} />

			<Separator />

			<CompleteResearchCard research={props.research} testBatches={props.testBatches} />

			<ArchiveResearchCard research={props.research} />
		</div>
	)
}
