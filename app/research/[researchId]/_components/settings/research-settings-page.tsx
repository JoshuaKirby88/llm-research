import { Separator } from "@/components/ui/separator"
import { ResearchT } from "@/src/schemas"
import { ArchiveResearchCard } from "./archive-research-card"
import { ResearchNameAndDescriptionAndConclusionForm } from "./research-name-and-description-and-conclusion-form"

export const ResearchSettingsPage = (props: { research: ResearchT }) => {
	return (
		<div className="flex flex-col gap-10">
			<ResearchNameAndDescriptionAndConclusionForm research={props.research} />

			<Separator />

			<ArchiveResearchCard research={props.research} />
		</div>
	)
}
