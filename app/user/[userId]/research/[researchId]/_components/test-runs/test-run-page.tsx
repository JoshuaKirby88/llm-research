import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ContributorT, DependentValueT, TestBatchResultT, TestBatchT, TestModelBatchT } from "@/src/schemas"
import { ClerkUser } from "@/src/services/clerk.service"
import { User } from "@clerk/nextjs/server"
import { BeanOffIcon, UserIcon, UsersIcon } from "lucide-react"
import { TestRunTabPage } from "./_components/test-run-tab-page"

type Props = {
	searchParams: Awaited<NextSearchParams>
	user: ClerkUser
	users: User[]
	contributors: ContributorT[]
	testBatches: TestBatchT[]
	testModelBatches: TestModelBatchT[]
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

const config = {
	tabName: "tests",
	tabs: [
		{ value: "All", icon: BeanOffIcon },
		{ value: "Yours", icon: UserIcon },
		{ value: "Contributions", icon: UsersIcon },
	],
} as const
export const testRunPageConfig = config

export const TestRunPage = (props: Props) => {
	return (
		<div className="flex w-full">
			<PageTabs tabs={config.tabs} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList name={config.tabName} tabs={config.tabs} />

				{config.tabs.map(tab => (
					<TabsContent key={tab.value} value={tab.value} className="w-full space-y-10">
						<TestRunTabPage
							tab={tab.value}
							user={props.user}
							users={props.users}
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
