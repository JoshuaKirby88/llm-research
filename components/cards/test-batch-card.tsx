import { downloadResearchAction } from "@/actions/research/download-research.action"
import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, dropdownMenuItemVariants } from "@/components/ui/dropdown-menu"
import { DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"
import { ActionI } from "@/utils/actions/create-action"
import { cn } from "@/utils/cn"
import { DownloadIcon, EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { FormRouteHandler } from "../form/server/form-route-handler"
import { buttonVariants } from "../ui/button"
import { CardContent, CardFooter, cardVariants } from "../ui/card"

type Props = {
	research: ResearchT
	currentUser: ClerkQueriedUser | undefined
	dependentValues: DependentValueT[]
	testBatch: TestBatchT
	testModelBatches: TestModelBatchT[]
	testBatchResults: TestBatchResultT[]
	children?: React.ReactNode
}

export const TestBatchCard = (props: Props) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.research.userId}/research/${props.research.id}/test/${props.testBatch.id}`} className={cardVariants({ padding: "sm" })}>
				<CardContent className="flex justify-between">
					<div>
						<p className="text-muted-foreground">{props.testBatch.createdAt.toLocaleDateString()}</p>
						<p>Models: {props.testModelBatches.map(tmb => tmb.model).join(", ")}</p>
						<p>Iterations: {props.testBatch.iterations}</p>
						<p>Total iterations: {props.testBatch.testCount}</p>
					</div>

					<ResearchChartCard dependentValues={props.dependentValues} testBatchResults={props.testBatchResults} className="size-40 p-0">
						<ResearchChart />
						<ResearchChartNoResultOverlay />
					</ResearchChartCard>
				</CardContent>

				{props.children}

				<CardFooter>
					<div className="h-8" />
				</CardFooter>
			</Link>

			<CardFooter className="absolute inset-x-0 bottom-0 justify-between p-3">
				<ClerkPFP userId={props.research.userId} size="sm" user={props.currentUser} nameAsLink />
				<TestBatchCardDropdown research={props.research} testBatch={props.testBatch} />
			</CardFooter>
		</div>
	)
}

const TestBatchCardDropdown = (props: { research: ResearchT; testBatch: TestBatchT }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn(buttonVariants({ variant: "matte", size: "iconSm" }), "rounded-full")}>
				<EllipsisIcon />
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<FormRouteHandler
					as="button"
					action="/api/download-research"
					input={{ researchId: props.research.id, testBatchId: props.testBatch.id } satisfies ActionI<typeof downloadResearchAction>}
					className={dropdownMenuItemVariants()}
				>
					<DownloadIcon />
					Download
				</FormRouteHandler>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
