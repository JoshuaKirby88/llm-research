import { ResearchChart, ResearchChartCard, ResearchChartNoResultOverlay } from "@/app/user/[userId]/research/[researchId]/_components/overview/research-chart"
import { DependentValueT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { User } from "@clerk/nextjs/server"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { CardContent, CardFooter, cardVariants } from "../ui/card"

type Props = {
	dependentValues: DependentValueT[]
	testBatch: TestBatchT
	testModelBatches: TestModelBatchT[]
	testBatchResults: TestBatchResultT[]
}

export const TestBatchCard = (props: { user: User | undefined; children?: React.ReactNode } & Props) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.user?.id}/research/${props.testBatch.researchId}/test/${props.testBatch.id}`} className={cardVariants({ padding: "sm" })}>
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
					<ClerkPFP size="sm" user={props.user} />
				</CardFooter>
			</Link>
		</div>
	)
}
