import { queryResearchAction } from "@/actions/research/query-research.action"
import { Separator } from "@/components/ui/separator"
import { ActionO } from "@/utils/actions/create-action"
import { ArchiveResearchCard } from "./archive-research-card"
import { ResearchNameAndDescriptionAndConclusionForm } from "./research-name-and-description-and-conclusion-form"

export const ResearchSettingsPage = (props: NonNullable<RequiredObj<ActionO<typeof queryResearchAction>>>) => {
	return (
		<div className="flex flex-col gap-10">
			<ResearchNameAndDescriptionAndConclusionForm {...props} />

			<Separator />

			<ArchiveResearchCard {...props} />
		</div>
	)
}
