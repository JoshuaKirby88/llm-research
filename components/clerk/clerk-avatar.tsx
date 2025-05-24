import { ClerkQueriedUser } from "@/src/services/clerk.service"
import Link from "next/link"
import { ComponentProps } from "react"
import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "../ui/avatar"
import { Badge } from "../ui/badge"

type Props = {
	userId: string
	user: ClerkQueriedUser | undefined
	badge?: React.ReactNode
} & PickRequired<ComponentProps<typeof Avatar>, "size">

const config = {
	variants: {
		size: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 } satisfies Record<keyof AvatarProps["size"], any>,
	},
}

export const ClerkAvatar = ({ userId, user, badge, ...props }: Props) => {
	const userName = user?.fullName ?? "User is deleted"
	const size = config.variants.size[props.size]

	const params = new URLSearchParams()
	params.set("height", size.toString())
	params.set("width", size.toString())
	params.set("quality", "100")
	params.set("fit", "fill")

	return (
		<Link href={`/user/${userId}`} className="group flex items-center gap-2">
			<div className="relative">
				<Avatar {...props}>
					<AvatarImage src={`${user?.imageUrl}?${params.toString()}`} alt="User image" />
					<AvatarFallback />
				</Avatar>

				{badge && (
					<Badge className="-top-3 -translate-x-3 absolute left-full border-background" size="roundSm">
						{badge}
					</Badge>
				)}
			</div>

			<p className="font-medium group-hover:underline">{userName}</p>
		</Link>
	)
}
