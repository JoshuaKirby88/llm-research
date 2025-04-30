import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { FlaskConicalIcon, GiftIcon, UserIcon } from "lucide-react"
import { UserResearchPage } from "./_components/user-research/user-research-page"

const config = {
	tabs: [
		{ value: "User", icon: UserIcon },
		{ value: "Research", icon: FlaskConicalIcon },
		{ value: "Contributions", icon: GiftIcon },
	],
} as const

const Page = async (props: { params: Promise<{ userId: string }>; searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams

	return (
		<div className="w-full max-w-4xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="User"></TabsContent>

				<TabsContent value="Research">
					<UserResearchPage searchParams={props.searchParams} />
				</TabsContent>

				<TabsContent value="Contributions"></TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
