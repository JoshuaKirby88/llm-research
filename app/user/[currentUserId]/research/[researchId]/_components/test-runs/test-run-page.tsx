import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ContributorT, DependentValueT, ResearchT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/services/clerk.service"
import { BeanOffIcon, UserIcon, UsersIcon } from "lucide-react"
import { TestRunTabPage } from "./_components/test-run-tab-page"

export type TestRunTabId = "All" | "Own" | "Contributions"

type Props = {
	searchParams: Awaited<NextSearchParam>
	user: ClerkPublicUser
	queriedUsers: ClerkQueriedUser[]
	research: ResearchT
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

const config = {
	tabName: "tests",
	tabs: (input: { research: ResearchT; user: ClerkPublicUser }) =>
		[
			{ key: "All", value: "All", icon: BeanOffIcon },
			{ key: "Own", value: input.research.userId === input.user.userId ? "Yours" : "Own", icon: UserIcon },
			{ key: "Contributions", value: "Contributions", icon: UsersIcon },
		] as const satisfies { key: TestRunTabId; [key: string]: any }[],
}

export const TestRunPage = (props: Props) => {
	return (
		<div className="flex w-full">
			<PageTabs tabs={config.tabs(props)} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList name={config.tabName} tabs={config.tabs(props)} />

				{config.tabs(props).map(tab => (
					<TabsContent key={tab.value} value={tab.value} className="w-full space-y-10">
						<TestRunTabPage
							tab={tab.key}
							user={props.user}
							queriedUsers={props.queriedUsers}
							research={props.research}
							contributors={props.contributors}
							testBatches={props.testBatches}
							testModelBatches={props.testModelBatches}
							dependentValues={props.dependentValues}
							testBatchResults={props.testBatchResults}
						/>
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}
