import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { ClerkPublicUser, ResearchT, UserToStarredResearchT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { StarIcon } from "lucide-react"
import { ComponentProps } from "react"
import { FormActionButton } from "../form/server/form-action-button"

type Props = {
	user: ClerkPublicUser
	research: ResearchT
	userToStarredResearch: UserToStarredResearchT | undefined
} & Omit<ComponentProps<typeof FormActionButton>, "action">

export const ResearchStarButton = ({ user, research, userToStarredResearch, ...props }: Props) => {
	return (
		<FormActionButton
			disabled={!user.userId}
			{...props}
			as="button" // Render HTML button
			action={(userToStarredResearch ? unstarResearchAction : starResearchAction).bind(null, { researchId: research.id, currentUserId: research.userId })}
			className={cn("group flex items-center gap-2 rounded-full px-2 py-1 transition-colors not-disabled:hover:bg-blue-500/10", props.className)}
		>
			<StarIcon className={cn("size-6 text-blue-500 transition-all", userToStarredResearch && "fill-blue-500 text-blue-500")} />
			<p>{research.starCount}</p>
		</FormActionButton>
	)
}
