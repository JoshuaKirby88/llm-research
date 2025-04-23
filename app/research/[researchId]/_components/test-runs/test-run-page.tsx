import { queryResearchAction } from "@/actions/research/query-research.action"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ActionO } from "@/utils/actions/create-action"
import { BeanOffIcon, UserIcon, UsersIcon } from "lucide-react"
import { TestRunTabPage } from "./_components/test-run-tab-page"
import { ClerkUser } from "@/src/services/clerk.service"

const config = {
	tabName: "tests",
	tabs: [
		{ key: "all", title: "All", icon: BeanOffIcon },
		{ key: "yours", title: "Yours", icon: UserIcon },
		{ key: "external", title: "External", icon: UsersIcon },
	],
} as const

export const TestRunPage = ({ searchParams, ...props }: { searchParams: Awaited<NextSearchParams>; user: ClerkUser } & NonNullable<RequiredObj<ActionO<typeof queryResearchAction>>>) => {
	return (
		<div className="flex w-full">
			<PageTabs tabs={config.tabs} name={config.tabName} searchParams={searchParams} orientation="vertical">
				<PageTabsList name={config.tabName} tabs={config.tabs} />

				{config.tabs.map(tab => (
					<TabsContent key={tab.key} value={tab.key} className="w-full space-y-10">
						<TestRunTabPage tab={tab.key} {...props} />
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}
