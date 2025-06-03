import { ResearchChart, ResearchChartCard } from "@/components/research-chart"
import { DependentValueT, ResearchT, TestBatchResultT } from "@/src/schemas"

export const ResearchResultPage = (props: { research: ResearchT; dependentValues: DependentValueT[]; testBatchResults: TestBatchResultT[] }) => {
	return (
		<div className="flex gap-5">
			<ResearchChartCard research={props.research} dependentValues={props.dependentValues} testBatchResults={props.testBatchResults} className="w-[40rem]">
				<ResearchChart />
			</ResearchChartCard>

			<p>{props.research.conclusion}</p>
		</div>
	)
}
