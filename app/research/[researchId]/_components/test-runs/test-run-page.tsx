import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ContributorT, TestBatchT, TestModelBatchT } from "@/src/schemas"
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
}

const config = {
	tabName: "tests",
	tabs: [
		{ key: "all", title: "All", icon: BeanOffIcon },
		{ key: "yours", title: "Yours", icon: UserIcon },
		{ key: "external", title: "External", icon: UsersIcon },
	],
} as const

export const TestRunPage = (props: Props) => {
	return (
		<div className="flex w-full">
			<PageTabs tabs={config.tabs} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList name={config.tabName} tabs={config.tabs} />

				{config.tabs.map(tab => (
					<TabsContent key={tab.key} value={tab.key} className="w-full space-y-10">
						<TestRunTabPage
							tab={tab.key}
							user={props.user}
							users={props.users}
							contributors={props.contributors}
							testBatches={props.testBatches}
							testModelBatches={props.testModelBatches}
						/>
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}
