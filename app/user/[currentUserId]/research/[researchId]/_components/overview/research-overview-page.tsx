import { ClerkPFP } from "@/components/clerk/clerk-pfp"
import { ResearchChart, ResearchChartCard, ResearchChartFooter, ResearchChartHeader, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"
import { CalendarIcon, CheckCircle2Icon, GitForkIcon } from "lucide-react"
import Link from "next/link"

type Props = {
	currentUser: ClerkQueriedUser | undefined
	research: ResearchT
	forkedResearch: ResearchT | null
	contributors: ContributorT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const ResearchOverviewPage = (props: Props) => {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-semibold text-3xl">{props.research.name}</h1>

			<div className="flex gap-4">
				<ResearchChartCard dependentValues={props.dependentValues} testBatchResults={props.testBatchResults}>
					<ResearchChartHeader />
					<ResearchChart />
					<ResearchChartFooter />
					<ResearchChartNoResultOverlay />
				</ResearchChartCard>

				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<ClerkPFP
							userId={props.research.userId}
							user={props.currentUser}
							size="sm"
							badge={props.currentUser ? props.contributors.find(c => c.userId === props.currentUser!.id)?.count : undefined}
							nameAsLink
						/>
					</div>
					<div className="flex items-center gap-2">
						<CalendarIcon />
						Created: {props.research.createdAt.toLocaleDateString()}
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2Icon />
						Stats: {props.research.isComplete ? "Complete" : "Researching"}
					</div>

					{props.forkedResearch && (
						<div className="flex items-center gap-2">
							<GitForkIcon />
							<p className="whitespace-pre-wrap">Fork Of: </p>
							<Link href={`/user/${props.forkedResearch.userId}/research/${props.forkedResearch.id}`} className="truncate text-blue-600 hover:underline">
								{props.forkedResearch.name}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
