import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuFormActionItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResearchT, UserToStarredResearchT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { User } from "@clerk/nextjs/server"
import { ArchiveIcon, ArchiveRestoreIcon, EllipsisIcon, StarIcon, StarOffIcon } from "lucide-react"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { Button, ButtonProps } from "../ui/button"

type Props = {
	research: ResearchT
	userToStarredResearch: UserToStarredResearchT | undefined
}

export const HomePageResearchCard = (props: Props & { user: User | undefined }) => {
	return (
		<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cn(cardVariants(), "p-4")}>
			<CardTitle className="text-2xl">{props.research.name}</CardTitle>

			<CardFooter className="mt-auto gap-5 p-0">
				<ClerkPFP user={props.user} size="sm" />

				<ResearchCardStars research={props.research} userToStarredResearch={props.userToStarredResearch} />
			</CardFooter>
		</Link>
	)
}

export const ResearchCard = (props: Props & { children?: React.ReactNode }) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cardVariants({ padding: "sm" })}>
				<CardHeader>
					<p className="text-muted-foreground">{props.research.createdAt.toLocaleDateString()}</p>
					<CardTitle>{props.research.name}</CardTitle>
					<CardDescription>Research description. This is a research item.</CardDescription>
				</CardHeader>

				{props.children}

				<CardFooter>
					<ResearchCardStars research={props.research} userToStarredResearch={props.userToStarredResearch} />
				</CardFooter>
			</Link>

			<ResearchCardDropdown research={props.research} userToStarredResearch={props.userToStarredResearch} className="absolute right-3 bottom-3" />
		</div>
	)
}

const ResearchCardDropdown = ({ research, userToStarredResearch, ...props }: Props & ButtonProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="matte" size="iconSm" {...props} className={cn(props.className)}>
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuFormActionItem action={(userToStarredResearch ? unstarResearchAction : starResearchAction).bind(null, { researchId: research.id })}>
					{userToStarredResearch ? <StarOffIcon /> : <StarIcon />}
					{userToStarredResearch ? "Unstar" : "Star"}
				</DropdownMenuFormActionItem>

				<DropdownMenuSeparator />

				<DropdownMenuFormActionItem
					variant={research.isArchived ? "inverseBlue" : "inverseRed"}
					action={(research.isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: research.id })}
				>
					{research.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
					{research.isArchived ? "Restore" : "Archive"}
				</DropdownMenuFormActionItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const ResearchCardStars = (props: Props) => {
	return (
		<div className="flex items-center gap-1">
			<StarIcon className={cn(props.userToStarredResearch && "fill-yellow-400 text-yellow-400")} /> {props.research.starCount}
		</div>
	)
}
