import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { downloadResearchAction } from "@/actions/research/download-research.action"
import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, dropdownMenuItemVariants } from "@/components/ui/dropdown-menu"
import { DateFeature } from "@/src/features/date.feature"
import { DependentValueT, ResearchT, TestBatchResultT, UserToStarredResearchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/schemas"
import { ActionI } from "@/utils/actions/create-action"
import { cn } from "@/utils/cn"
import { ArchiveIcon, ArchiveRestoreIcon, DownloadIcon, EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { ResearchStarButton } from "../buttons/research-star-button"
import { ClerkHoverCard } from "../clerk/clerk-hover-card"
import { FormActionButton } from "../form/server/form-action-button"
import { FormRouteHandler } from "../form/server/form-route-handler"
import { buttonVariants } from "../ui/button"

type Props = {
	user: ClerkPublicUser
	currentUser: ClerkQueriedUser | undefined
	research: ResearchT
	userToStarredResearch: UserToStarredResearchT | undefined
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const HomePageResearchCard = (props: Pick<Props, "user" | "currentUser" | "research" | "userToStarredResearch">) => {
	return (
		<Card size="none">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cardVariants({ size: "sm", variant: "link" })}>
				<CardHeader>
					<CardTitle className="text-xl">{props.research.name}</CardTitle>
				</CardHeader>
			</Link>

			<CardFooter variant="link">
				<ClerkHoverCard userId={props.research.userId} user={props.currentUser} size="sm" />

				<ResearchStarButton user={props.user} research={props.research} userToStarredResearch={props.userToStarredResearch} />
			</CardFooter>
		</Card>
	)
}

export const ResearchCard = (props: Props & { children?: React.ReactNode }) => {
	return (
		<Card size="none">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}`} className={cardVariants({ size: "sm", variant: "link" })}>
				<CardContent className="flex justify-between">
					<div>
						<p className="mb-2 text-muted-foreground text-sm">{DateFeature.toMonthYear(props.research.createdAt)}</p>
						<CardTitle className="text-xl">{props.research.name}</CardTitle>
					</div>

					<ResearchChartCard research={props.research} dependentValues={props.dependentValues} testBatchResults={props.testBatchResults} className="size-40 p-0">
						<ResearchChart />
						<ResearchChartNoResultOverlay className="text-xs" />
					</ResearchChartCard>
				</CardContent>
			</Link>

			<CardFooter variant="link">
				<div className="flex items-center gap-4">
					<ClerkHoverCard userId={props.research.userId} user={props.currentUser} size="sm" />
					<ResearchStarButton user={props.user} research={props.research} userToStarredResearch={props.userToStarredResearch} />
				</div>

				<ResearchCardDropdown
					user={props.user}
					currentUser={props.currentUser}
					research={props.research}
					userToStarredResearch={props.userToStarredResearch}
					dependentValues={props.dependentValues}
					testBatchResults={props.testBatchResults}
				/>
			</CardFooter>
		</Card>
	)
}

const ResearchCardDropdown = (props: Props) => {
	return (
		props.user.userId && (
			<DropdownMenu>
				<DropdownMenuTrigger className={cn(buttonVariants({ variant: "matte", size: "iconSm" }), "rounded-full")}>
					<EllipsisIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<FormRouteHandler
						action="/api/download-research"
						input={{ researchId: props.research.id } satisfies ActionI<typeof downloadResearchAction>}
						size="sm"
						variant="ghost"
						className={dropdownMenuItemVariants()}
					>
						<DownloadIcon />
						Download
					</FormRouteHandler>

					{props.user.userId === props.research.userId && (
						<>
							<DropdownMenuSeparator />

							<FormActionButton
								action={(props.research.isArchived ? unarchiveResearchAction : archiveResearchAction).bind(null, { researchId: props.research.id })}
								size="sm"
								variant="ghost"
								className={dropdownMenuItemVariants({ variant: props.research.isArchived ? "inverseBlue" : "inverseRed" })}
							>
								{props.research.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
								{props.research.isArchived ? "Restore" : "Archive"}
							</FormActionButton>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	)
}
