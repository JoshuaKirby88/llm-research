import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { IconWrapper } from "@/components/icon-wrapper"
import { ResearchT } from "@/src/schemas"
import { ArchiveIcon, ArchiveRestoreIcon } from "lucide-react"

export const ArchiveResearchCard = (props: { research: ResearchT }) => {
	const isArchived = props.research.isArchived

	return (
		<AlertCard>
			<IconWrapper>
				<ArchiveIcon />
			</IconWrapper>

			<AlertCardContent title={isArchived ? "Unarchive Research" : "Archive Research"} description="Archiving a research will hide it from public view without deleting it.">
				<FormActionButton variant={isArchived ? "blue" : "red"} action={(isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: props.research.id })}>
					{isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
					{isArchived ? "Unarchive" : "Archive"}
				</FormActionButton>
			</AlertCardContent>
		</AlertCard>
	)
}
