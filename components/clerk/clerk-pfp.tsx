import { omit } from "@/utils/omit"
import { ComponentProps } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { ClerkAvatar } from "./clerk-avatar"

export const ClerkPFP = (props: { userId: string } & ComponentProps<typeof ClerkAvatar>) => {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<ClerkAvatar {...props} />
			</HoverCardTrigger>

			<HoverCardContent>
				<div className="space-y-3">
					<ClerkAvatar {...omit(props, ["badge"])} size="lg" />

					<p className="text-muted-foreground text-sm">
						Designer at <strong className="font-medium text-foreground">@Origin UI</strong>. Crafting web experiences with Tailwind CSS.
					</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
