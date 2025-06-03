import { omit } from "@/utils/omit"
import { ComponentProps } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { ClerkAvatar } from "./clerk-avatar"

export const ClerkHoverCard = (props: { userId: string } & ComponentProps<typeof ClerkAvatar>) => {
	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<HoverCardTrigger asChild>
				<ClerkAvatar {...props} />
			</HoverCardTrigger>

			<HoverCardContent>
				<div className="space-y-3">
					<ClerkAvatar {...omit(props, ["badge"])} size="lg" overideImageSize={props.size} />

					{props.user?.metadata.bio && <p className="text-muted-foreground text-sm">{props.user.metadata.bio}</p>}
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
