import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { downloadResearchAction } from "@/actions/research/download-research.action"
import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, dropdownMenuItemVariants } from "@/components/ui/dropdown-menu"
import { DependentValueT, ResearchT, TestBatchResultT, UserToStarredResearchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/services/clerk.service"
import { ActionI } from "@/utils/actions/create-action"
import { cn } from "@/utils/cn"
import { ArchiveIcon, ArchiveRestoreIcon, DownloadIcon, EllipsisIcon, StarIcon, StarOffIcon } from "lucide-react"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { FormActionButton } from "../form/server/form-action-button"
import { FormRouteHandler } from "../form/server/form-route-handler"
import { buttonVariants } from "../ui/button"

type Props = {
	research: ResearchT
	userToStarredResearch: UserToStarredResearchT | undefined
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const HomePageResearchCard = (props: Pick<Props, "research" | "userToStarredResearch"> & { currentUser: ClerkQueriedUser | undefined }) => {
	return (
		<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cn(cardVariants(), "p-4")}>
			<CardTitle className="text-2xl">{props.research.name}</CardTitle>

			<CardFooter className="mt-auto gap-5 p-0">
				<ClerkPFP userId={props.research.userId} user={props.currentUser} size="sm" />

				<ResearchCardStars research={props.research} userToStarredResearch={props.userToStarredResearch} />
			</CardFooter>
		</Link>
	)
}

export const ResearchCard = (props: Props & { user: ClerkPublicUser; children?: React.ReactNode }) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cn(cardVariants({ padding: "sm" }), "relative pb-14")}>
				<CardHeader>
					<p className="text-muted-foreground">{props.research.createdAt.toLocaleDateString()}</p>
					<CardTitle>{props.research.name}</CardTitle>
					<CardDescription>
						<p>Status: {props.research.isPublished ? "Published" : "Researching"}</p>
					</CardDescription>
				</CardHeader>

				<div className="!aspect-square absolute top-2 right-2 bottom-16">
					<ResearchChartCard dependentValues={props.dependentValues} testBatchResults={props.testBatchResults} className="aspect-square h-full p-0">
						<ResearchChart />
						<ResearchChartNoResultOverlay className="text-xs" />
					</ResearchChartCard>
				</div>

				{props.children}

				<CardFooter>
					<div className="h-8" />
				</CardFooter>
			</Link>

			<CardFooter className="absolute inset-x-4 bottom-4 justify-between">
				<ResearchCardStars research={props.research} userToStarredResearch={props.userToStarredResearch} />
				<ResearchCardDropdown
					user={props.user}
					research={props.research}
					userToStarredResearch={props.userToStarredResearch}
					dependentValues={props.dependentValues}
					testBatchResults={props.testBatchResults}
				/>
			</CardFooter>
		</div>
	)
}

const ResearchCardDropdown = (props: Props & { user: ClerkPublicUser }) => {
	return (
		props.user.userId && (
			<DropdownMenu>
				<DropdownMenuTrigger className={cn(buttonVariants({ variant: "matte", size: "iconSm" }), "rounded-full")}>
					<EllipsisIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<FormActionButton
						as="button"
						className={dropdownMenuItemVariants()}
						action={(props.userToStarredResearch ? unstarResearchAction : starResearchAction).bind(null, { researchId: props.research.id, currentUserId: props.research.userId })}
					>
						{props.userToStarredResearch ? <StarOffIcon /> : <StarIcon />}
						{props.userToStarredResearch ? "Unstar" : "Star"}
					</FormActionButton>

					<FormRouteHandler
						as="button"
						action="/api/download-research"
						input={{ researchId: props.research.id } satisfies ActionI<typeof downloadResearchAction>}
						className={dropdownMenuItemVariants()}
					>
						<DownloadIcon />
						Download
					</FormRouteHandler>

					<DropdownMenuSeparator />

					{props.user.userId === props.research.userId && (
						<FormActionButton
							as="button"
							action={(props.research.isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: props.research.id })}
							className={dropdownMenuItemVariants({ variant: props.research.isArchived ? "inverseBlue" : "inverseRed" })}
						>
							{props.research.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
							{props.research.isArchived ? "Restore" : "Archive"}
						</FormActionButton>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	)
}

const ResearchCardStars = (props: Pick<Props, "research" | "userToStarredResearch">) => {
	return (
		<div className="flex items-center gap-1">
			<StarIcon className={cn(props.userToStarredResearch && "fill-yellow-400 text-yellow-400")} /> {props.research.starCount}
		</div>
	)
}
