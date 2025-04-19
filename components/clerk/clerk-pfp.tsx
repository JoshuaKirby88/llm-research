import { ComponentProps } from "react"
import { Avatar, AvatarImage } from "../ui/avatar"

export const ClerkPFP = async ({ imageUrl, width, height, ...props }: { imageUrl: string; width: number; height: number } & ComponentProps<typeof Avatar>) => {
	const params = new URLSearchParams()

	params.set("height", height.toString())
	params.set("width", width.toString())
	params.set("quality", "100")
	params.set("fit", "crop")

	return (
		<Avatar {...props}>
			<AvatarImage src={`${imageUrl}?${params.toString()}`} alt="User image" />
		</Avatar>
	)
}
