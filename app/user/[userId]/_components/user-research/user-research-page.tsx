import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ArchiveIcon, CheckCircle2Icon, FlaskConicalIcon, NotebookPenIcon } from "lucide-react"
import { ResearchPage } from "./research-page"

const config = {
	tabs: [
		{ value: "All", icon: FlaskConicalIcon },
		{ value: "Complete", icon: CheckCircle2Icon },
		{ value: "Researching", icon: NotebookPenIcon },
		{ value: "Archived", icon: ArchiveIcon },
	],
} as const
export const userResearchPageConfig = config

export const UserResearchPage = async (props: { searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams

	return (
		<div className="w-full">
			<PageTabs tabs={config.tabs} searchParams={searchParams} orientation="vertical">
				<PageTabsList tabs={config.tabs} />

				{config.tabs.map(tab => (
					<TabsContent key={tab.value} value={tab.value} className="space-y-10">
						<ResearchPage tab={tab.value} />
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}
