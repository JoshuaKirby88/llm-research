import { ClerkProfile } from "@/components/clerk/clerk-profile"
import { ResearchChart, ResearchChartCard, ResearchChartFooter, ResearchChartHeader, ResearchChartNoResultOverlay } from "@/components/research-chart"
import { VariableBadge } from "@/components/variable-badge"
import { BlockingValueT, BlockingVariableT, ContributorT, DependentValueT, IndependentValueT, IndependentVariableT, ResearchT, TestBatchResultT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"
import { CalendarIcon, CheckCircle2Icon, GitForkIcon, VariableIcon } from "lucide-react"
import Link from "next/link"

type Props = {
	currentUser: ClerkQueriedUser | undefined
	research: ResearchT
	forkedResearch: ResearchT | undefined
	contributors: ContributorT[]
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariables: BlockingVariableT[]
	blockingValues: BlockingValueT[]
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
						<ClerkProfile
							userId={props.research.userId}
							user={props.currentUser}
							size="sm"
							badge={props.currentUser ? props.contributors.find(c => c.userId === props.currentUser!.id)?.count : undefined}
						/>
					</div>
					<div className="flex items-center gap-2">
						<CalendarIcon />
						Created: {props.research.createdAt.toLocaleDateString()}
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2Icon />
						Status: {props.research.isPublished ? "Published" : "Researching"}
					</div>
					<div className="flex items-center gap-2">
						<VariableIcon />
						Independent Variable: <VariableBadge variable={props.independentVariable} values={props.independentValues} />
					</div>
					<div className="flex items-center gap-2">
						<VariableIcon />
						Blocking Variables:{" "}
						{props.blockingVariables.map(bVar => (
							<VariableBadge key={bVar.id} variable={bVar} values={props.blockingValues.filter(bVal => bVal.blockingVariableId === bVar.id)} />
						))}
					</div>
					<div className="flex items-center gap-2">
						<VariableIcon />
						Dependent Variable: <VariableBadge variable={{ name: "Dependent Variable" }} values={props.dependentValues} />
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
