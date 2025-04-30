import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/app/user/[userId]/research/[researchId]/_components/overview/research-chart"
import { CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuFormActionItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DependentValueT, ResearchT, TestBatchResultT, UserToStarredResearchT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { User } from "@clerk/nextjs/server"
import { ArchiveIcon, ArchiveRestoreIcon, EllipsisIcon, StarIcon, StarOffIcon } from "lucide-react"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { Button } from "../ui/button"

type Props = {
	research: ResearchT
	userToStarredResearch: UserToStarredResearchT | undefined
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const HomePageResearchCard = ({ user, ...props }: Pick<Props, "research" | "userToStarredResearch"> & { user: User | undefined }) => {
	return (
		<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cn(cardVariants(), "p-4")}>
			<CardTitle className="text-2xl">{props.research.name}</CardTitle>

			<CardFooter className="mt-auto gap-5 p-0">
				<ClerkPFP user={user} size="sm" />

				<ResearchCardStars {...props} />
			</CardFooter>
		</Link>
	)
}

export const ResearchCard = ({ children, ...props }: Props & { children?: React.ReactNode }) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cn(cardVariants({ padding: "sm" }), "relative pb-14")}>
				<CardHeader>
					<p className="text-muted-foreground">{props.research.createdAt.toLocaleDateString()}</p>
					<CardTitle>{props.research.name}</CardTitle>
					<CardDescription>
						<p>Status: {props.research.isComplete ? "Complete" : "Researching"}</p>
					</CardDescription>
				</CardHeader>

				<div className="!aspect-square absolute top-2 right-2 bottom-16">
					<ResearchChartCard {...props} className="aspect-square h-full p-0">
						<ResearchChart />
						<ResearchChartNoResultOverlay className="text-xs" />
					</ResearchChartCard>
				</div>

				{children}

				<CardFooter>
					<div className="h-8" />
				</CardFooter>
			</Link>

			<CardFooter className="absolute inset-x-4 bottom-4 justify-between">
				<ResearchCardStars {...props} />
				<ResearchCardDropdown {...props} />
			</CardFooter>
		</div>
	)
}

const ResearchCardDropdown = (props: Props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="matte" size="iconSm">
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuFormActionItem
					action={(props.userToStarredResearch ? unstarResearchAction : starResearchAction).bind(null, { researchId: props.research.id, researchUserId: props.research.userId })}
				>
					{props.userToStarredResearch ? <StarOffIcon /> : <StarIcon />}
					{props.userToStarredResearch ? "Unstar" : "Star"}
				</DropdownMenuFormActionItem>

				<DropdownMenuSeparator />

				<DropdownMenuFormActionItem
					variant={props.research.isArchived ? "inverseBlue" : "inverseRed"}
					action={(props.research.isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: props.research.id })}
				>
					{props.research.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
					{props.research.isArchived ? "Restore" : "Archive"}
				</DropdownMenuFormActionItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const ResearchCardStars = (props: Pick<Props, "research" | "userToStarredResearch">) => {
	return (
		<div className="flex items-center gap-1">
			<StarIcon className={cn(props.userToStarredResearch && "fill-yellow-400 text-yellow-400")} /> {props.research.starCount}
		</div>
	)
}
