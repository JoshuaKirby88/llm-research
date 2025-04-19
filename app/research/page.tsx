import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const Page = () => {
	return (
		<div className="w-full max-w-2xl">
			<Tabs defaultValue={config.tabs[0].key}>
				<TabsList className="mb-10">
					{config.tabs.map(tab => (
						<TabsTrigger key={tab.key} value={tab.key} className="gap-2">
							<tab.icon className="text-muted-foreground" />
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>

				{config.tabs.map(tab => (
					<TabsContent key={tab.key} value={tab.key} className="space-y-10">
						<ResearchPage tab={tab.key} />
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

export default Page
