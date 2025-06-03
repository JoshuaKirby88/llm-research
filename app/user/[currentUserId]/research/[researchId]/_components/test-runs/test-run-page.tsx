import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/schemas"
import { BeanOffIcon, GiftIcon, UserIcon } from "lucide-react"
import { TestRunTabPage } from "./_components/test-run-tab-page"

type Props = {
	searchParams: Awaited<NextSearchParam>
	params: NextParam<"currentUserId" | "researchId">
	queriedUsers: ClerkQueriedUser[]
	research: ResearchT
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

const config = {
	tabName: "testTab",
	tabs: [
		{ value: "All", icon: BeanOffIcon },
		{ value: "Authored", icon: UserIcon },
		{ value: "Contributions", icon: GiftIcon },
	],
} as const

export const TestRunPage = (props: Props) => {
	return (
		<div className="flex w-full">
			<PageTabs tabs={config.tabs} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList name={config.tabName} tabs={config.tabs} />

				{config.tabs.map(tab => {
					const currentContributor = props.contributors.find(c => c.userId === props.params.currentUserId)
					const testBatches = props.testBatches.filter(
						tb =>
							tab.value === "All" ||
							(tab.value === "Authored" && currentContributor && tb.contributorId === currentContributor.id) ||
							(tab.value === "Contributions" && (!currentContributor || tb.contributorId !== currentContributor.id)),
					)

					return (
						<TabsContent key={tab.value} value={tab.value} className="w-full space-y-10">
							<TestRunTabPage
								queriedUsers={props.queriedUsers}
								research={props.research}
								contributors={props.contributors}
								testBatches={testBatches}
								testModelBatches={props.testModelBatches}
								dependentValues={props.dependentValues}
								testBatchResults={props.testBatchResults}
							/>
						</TabsContent>
					)
				})}
			</PageTabs>
		</div>
	)
}
