import { ClerkQueriedUser } from "@/src/services/clerk.service"
import Link from "next/link"
import { ComponentProps } from "react"
import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "../ui/avatar"
import { Badge } from "../ui/badge"

const variants = {
	size: {
		xs: 24,
		sm: 28,
		md: 32,
		lg: 36,
		xl: 40,
	} satisfies Record<keyof AvatarProps["size"], any>,
}

export const ClerkPFP = async ({
	user,
	nameAsLink,
	badge,
	...props
}: { user: ClerkQueriedUser | undefined; nameAsLink?: boolean; badge?: React.ReactNode } & PickRequired<ComponentProps<typeof Avatar>, "size">) => {
	const params = new URLSearchParams()

	params.set("height", variants.size[props.size].toString())
	params.set("width", variants.size[props.size].toString())
	params.set("quality", "100")
	params.set("fit", "crop")

	return (
		<div className="flex items-center gap-2">
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

			{nameAsLink ? (
				<Link href={`/user/${user?.id}`} className="text-blue-600 hover:underline">
					{user?.fullName}
				</Link>
			) : (
				user?.fullName
			)}
		</div>
	)
}
