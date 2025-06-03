import { archiveResearchAction, unarchiveResearchAction } from "@/actions/research/archive-research.action"
import { downloadResearchAction } from "@/actions/research/download-research.action"
import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, dropdownMenuItemVariants } from "@/components/ui/dropdown-menu"
import { DependentValueT, ResearchT, TestBatchResultT, UserToStarredResearchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/schemas"
import { ActionI } from "@/utils/actions/create-action"
import { cn } from "@/utils/cn"
import { ArchiveIcon, ArchiveRestoreIcon, DownloadIcon, EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { ResearchStarButton } from "../buttons/research-star-button"
import { ClerkProfile } from "../clerk/clerk-profile"
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
					<CardTitle className="text-2xl">{props.research.name}</CardTitle>
				</CardHeader>
			</Link>

			<CardFooter variant="link">
				<ClerkProfile userId={props.research.userId} user={props.currentUser} size="sm" />

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
						<p className="mb-2 text-muted-foreground text-sm">{props.research.createdAt.toLocaleDateString()}</p>
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
					<ClerkProfile userId={props.research.userId} user={props.currentUser} size="sm" />
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
