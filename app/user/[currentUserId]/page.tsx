import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { authProcedure } from "@/utils/auth-procedure"
import { FlaskConicalIcon, GiftIcon, UserIcon } from "lucide-react"
import { ContributionPage } from "./_components/contribution/contribution-page"
import { UserResearchPage } from "./_components/user-research/user-research-page"
import { UserPage } from "./_components/user/user-page"

const config = {
	tabs: [
		{ value: "User", icon: UserIcon },
		{ value: "Research", icon: FlaskConicalIcon },
		{ value: "Contributions", icon: GiftIcon },
	],
} as const

const Page = async (props: { params: Promise<NextParam<"currentUserId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	return (
		<div className="w-full max-w-4xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="User">
					<UserPage params={params} />
				</TabsContent>

				<TabsContent value="Research">
					<UserResearchPage params={params} searchParams={searchParams} user={user} />
				</TabsContent>

				<TabsContent value="Contributions">
					<ContributionPage />
				</TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
