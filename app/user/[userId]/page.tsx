import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { FlaskConicalIcon, GiftIcon, UserIcon } from "lucide-react"

const config = {
	tabs: [
		{ key: "user", title: "User", icon: UserIcon },
		{ key: "research", title: "Research", icon: FlaskConicalIcon },
		{ key: "contributions", title: "Contributions", icon: GiftIcon },
	],
} as const

const Page = async (props: { params: Promise<{ userId: string }>; searchParams: NextSearchParams }) => {
	const params = await props.params
	const searchParams = await props.searchParams

	return (
		<div className="w-full max-w-5xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="user"></TabsContent>

				<TabsContent value="research"></TabsContent>

				<TabsContent value="contributions"></TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
