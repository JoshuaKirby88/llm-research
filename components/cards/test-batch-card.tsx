import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/app/user/[currentUserId]/research/[researchId]/_components/overview/research-chart"
import { DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
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
					<ClerkPFP size="sm" user={props.currentUser} />
				</CardFooter>
			</Link>
		</div>
	)
}
