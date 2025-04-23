import { User } from "@clerk/nextjs/server"
import { ComponentProps } from "react"
import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "../ui/avatar"

const variants = {
	size: {
		xs: 24,
		sm: 28,
		md: 32,
		lg: 36,
		xl: 40,
	} satisfies Record<keyof AvatarProps["size"], any>,
}

export const ClerkPFP = async ({ user, ...props }: { user: User | undefined } & PickRequired<ComponentProps<typeof Avatar>, "size">) => {
	const params = new URLSearchParams()

	params.set("height", variants.size[props.size].toString())
	params.set("width", variants.size[props.size].toString())
	params.set("quality", "100")
	params.set("fit", "crop")

	return (
		<div className="flex items-center gap-2">
			<Avatar {...props}>
				<AvatarImage src={`${user?.imageUrl}?${params.toString()}`} alt="User image" />
				<AvatarFallback />
			</Avatar>

			{user?.fullName}
		</div>
	)
}
