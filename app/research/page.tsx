import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ArchiveIcon, CheckCircle2Icon, FlaskConicalIcon, NotebookPenIcon } from "lucide-react"
import { ResearchPage } from "./_components/research-page"

const config = {
	tabs: [
		{ key: "all", title: "All", icon: FlaskConicalIcon },
		{ key: "complete", title: "Complete", icon: CheckCircle2Icon },
		{ key: "researching", title: "Researching", icon: NotebookPenIcon },
		{ key: "archived", title: "Archived", icon: ArchiveIcon },
	],
} as const

const Page = async (props: { searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams

	return (
		<div className="w-full max-w-2xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				{config.tabs.map(tab => (
					<TabsContent key={tab.key} value={tab.key} className="space-y-10">
						<ResearchPage tab={tab.key} />
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}

export default Page
