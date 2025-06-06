import { Separator } from "@/components/ui/separator"
import { DependentValueT, ResearchT, TestBatchT } from "@/src/schemas"
import { ArchiveResearchCard } from "./archive-research-card"
import { PublishResearchCard } from "./publish-research-card"
import { ResearchColorPicker } from "./research-color-picker"
import { ResearchNameAndDescriptionAndConclusionForm } from "./research-name-and-description-and-conclusion-form"

export const ResearchSettingsPage = (props: { research: ResearchT; dependentValues: DependentValueT[]; testBatches: TestBatchT[] }) => {
	return (
		<div className="flex flex-col gap-14">
			<ResearchNameAndDescriptionAndConclusionForm research={props.research} />

			<Separator />

			<ResearchColorPicker dependentValues={props.dependentValues} />

			<Separator />

			<PublishResearchCard research={props.research} testBatches={props.testBatches} />

			<Separator />

			<ArchiveResearchCard research={props.research} />
		</div>
	)
}
