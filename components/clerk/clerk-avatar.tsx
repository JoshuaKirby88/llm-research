import { ClerkQueriedUser } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { ComponentProps } from "react"
import { LinkButton } from "../buttons/link-button"
import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "../ui/avatar"
import { Badge } from "../ui/badge"

type Props = {
	userId: string
	user: ClerkQueriedUser | undefined
	badge?: React.ReactNode
	disabled?: boolean
	hideUserName?: boolean
	overideImageSize?: NonNullable<AvatarProps["size"]>
} & PickRequired<ComponentProps<typeof Avatar>, "size">

const config = {
	variants: {
		size: { "3xs": 16, "2xs": 20, xs: 24, sm: 28, md: 32, lg: 36, xl: 40, "2xl": 44, "3xl": 48, "19xl": 112 } satisfies Record<NonNullable<AvatarProps["size"]>, any>,
	},
}

export const ClerkAvatar = ({ userId, user, badge, disabled, hideUserName, overideImageSize, ...props }: Props) => {
	const userName = user ? user.fullName : "User deleted"

	const imageSize = config.variants.size[overideImageSize ?? props.size]

	const params = new URLSearchParams()
	params.set("height", imageSize.toString())
	params.set("width", imageSize.toString())
	params.set("quality", "100")
	params.set("fit", "fill")

	const imageUrl = user ? `${user.imageUrl}?${params.toString()}` : "/thiings/ghost.webp"

	return (
		<LinkButton href={`/user/${userId}?tab=User`} className="group pointer-events-auto flex items-center gap-2 opacity-100" disabled={disabled}>
			<div className="relative">
				<Avatar {...props}>
					<AvatarImage src={imageUrl} width={imageSize} height={imageSize} alt="Profile pic" />
					<AvatarFallback />
				</Avatar>

				{badge != undefined && (
					<Badge className="-top-3 -translate-x-3 absolute left-full border-background font-semibold" size="roundSm">
						{badge}
					</Badge>
				)}
			</div>

			{!hideUserName && <p className={cn("font-medium", !disabled && "group-hover:underline group-data-[state=open]:underline")}>{userName}</p>}
		</LinkButton>
	)
}
