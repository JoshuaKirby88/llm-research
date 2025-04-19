import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { queryResearchAction } from "@/actions/research/query-research.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { IconWrapper } from "@/components/icon-wrapper"
import { ActionO } from "@/utils/actions/create-action"
import { ArchiveIcon, ArchiveRestoreIcon } from "lucide-react"

export const ArchiveResearchCard = (props: NonNullable<RequiredObj<ActionO<typeof queryResearchAction>>>) => {
	const isArchived = props.research.isArchived

	return (
		<AlertCard>
			<IconWrapper>
				<ArchiveIcon />
			</IconWrapper>

			<AlertCardContent title={isArchived ? "Unarchive Research" : "Archive Research"} description="Archiving will not delete it completely. Archived researches will not be public.">
				<FormActionButton variant={isArchived ? "blue" : "red"} action={(isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: props.research.id })}>
					{isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
					{isArchived ? "Unarchive" : "Archive"}
				</FormActionButton>
			</AlertCardContent>
		</AlertCard>
	)
}
