import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { TabsContent } from "@/components/ui/tabs"
import { ClerkService } from "@/src/services/clerk.service"
import { authProcedure } from "@/utils/auth-procedure"
import { AlertTriangleIcon, FlaskConicalIcon, GiftIcon, UserIcon } from "lucide-react"
import { ContributionPage } from "./_components/contribution/contribution-page"
import { UserResearchPage } from "./_components/research/user-research-page"
import { UserPage } from "./_components/user/user-page"
import { userContributionPageQuery } from "./_queries/user-contribution-page-query"
import { userPageQuery } from "./_queries/user-page-query"
import { userResearchPageQuery } from "./_queries/user-research-page-query"

const config = {
	tabs: [
		{ value: "User", icon: UserIcon },
		{ value: "Research", icon: FlaskConicalIcon },
		{ value: "Contributions", icon: GiftIcon },
	],
}

const Page = Suspense(async (props: { params: Promise<NextParam<"currentUserId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const [userPageQueryResult, userResearchPageQueryResult, userContributionPageQueryResult] = await Promise.all([
		userPageQuery({ params }),
		userResearchPageQuery({ params, user }),
		userContributionPageQuery({ params, user }),
	])

	const queriedUsers = await ClerkService.queryUsers([
		params.currentUserId,
		...userResearchPageQueryResult.researches.map(r => r.userId),
		...userContributionPageQueryResult.researches.map(r => r.userId),
	])

	const currentUser = queriedUsers.find(u => u.id === params.currentUserId)

	return (
		<div className="w-full max-w-4xl space-y-5">
			{!currentUser && (
				<div className="flex items-center justify-center gap-2 rounded-md bg-red-500 p-2 text-sm text-white">
					<AlertTriangleIcon />
					This user is deleted.
				</div>
			)}

			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="User">
					<UserPage params={params} currentUser={currentUser} {...userPageQueryResult} />
				</TabsContent>

				<TabsContent value="Research">
					<UserResearchPage params={params} searchParams={searchParams} user={user} queriedUsers={queriedUsers} {...userResearchPageQueryResult} />
				</TabsContent>

				<TabsContent value="Contributions">
					<ContributionPage params={params} user={user} queriedUsers={queriedUsers} {...userContributionPageQueryResult} />
				</TabsContent>
			</PageTabs>
		</div>
	)
})

export default Page
