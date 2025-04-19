import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuFormActionItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResearchT, ResearchWithUserToStarredResearchT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { User } from "@clerk/nextjs/server"
import { ArchiveIcon, ArchiveRestoreIcon, EllipsisIcon, StarIcon, StarOffIcon } from "lucide-react"
import Link from "next/link"
import { ClerkPFP } from "./clerk/clerk-pfp"
import { Button, ButtonProps } from "./ui/button"

export const HomePageResearchCard = (props: { research: ResearchT; user: User }) => {
	return (
		<Link href={`/research/${props.research.id}`} className={cn(cardVariants(), "p-4")}>
			<CardTitle className="text-2xl">{props.research.name}</CardTitle>

			<CardFooter className="mt-auto gap-5 p-0">
				<div className="flex items-center gap-1">
					<ClerkPFP imageUrl={props.user.imageUrl} width={20} height={20} size="sm" />
					{props.user.username}
				</div>

				<ResearchCardStars research={props.research} />
			</CardFooter>
		</Link>
	)
}

export const ResearchCard = (props: { research: ResearchWithUserToStarredResearchT; children?: React.ReactNode }) => {
	return (
		<div className="relative">
			<Link href={`/research/${props.research.id}`} className={cardVariants({ padding: "sm" })}>
				<CardHeader>
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">{props.research.createdAt.toLocaleDateString()}</p>
						{props.research.userToStarredResearch.length ? <StarIcon className="fill-yellow-400 text-yellow-400" /> : null}
					</div>
					<CardTitle>{props.research.name}</CardTitle>
					<CardDescription>Research description. This is a research item.</CardDescription>
				</CardHeader>

				{props.children}

				<CardFooter>
					<ResearchCardStars research={props.research} />
				</CardFooter>
			</Link>

			<ResearchCardDropdown research={props.research} className="absolute right-3 bottom-3" />
		</div>
	)
}

const ResearchCardDropdown = ({ research, ...props }: { research: ResearchWithUserToStarredResearchT } & ButtonProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="matte" size="iconSm" {...props} className={cn(props.className)}>
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuFormActionItem action={(research.userToStarredResearch.length ? unstarResearchAction : starResearchAction).bind(null, { researchId: research.id })}>
					{research.userToStarredResearch.length ? <StarOffIcon /> : <StarIcon />}
					{research.userToStarredResearch.length ? "Unstar" : "Star"}
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

const ResearchCardStars = (props: { research: ResearchT }) => {
	return (
		<div className="flex items-center gap-1">
			<StarIcon /> {props.research.stars}
		</div>
	)
}
