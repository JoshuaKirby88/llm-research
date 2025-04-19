import { queryResearchAction } from "@/actions/research/query-research.action"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { actionIsValid } from "@/utils/actions/action-is-valid"
import { cn } from "@/utils/cn"
import { CogIcon, FlaskConicalIcon, RocketIcon, ShapesIcon, SquareStackIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ResearchOverviewPage } from "./_components/overview/research-overview-page"
import { ResearchSettingsPage } from "./_components/settings/research-settings-page"

const config = {
	tabs: [
		{ key: "overview", title: "Overview", icon: FlaskConicalIcon },
		{ key: "testRuns", title: "Test Runs", icon: SquareStackIcon },
		{ key: "result", title: "Result", icon: ShapesIcon },
		{ key: "settings", title: "Settings", icon: CogIcon },
	],
} as const

const Page = async (props: { params: Promise<{ researchId: string }> }) => {
	const params = await props.params
	const result = await actionIsValid(queryResearchAction({ researchId: Number.parseInt(params.researchId) }))

	if (!result) {
		notFound()
	}

	return (
		<div className="mx-auto w-full max-w-4xl">
			<Tabs defaultValue={config.tabs[0].key}>
				<div className="mb-10 flex items-center gap-5">
					<TabsList className="">
						{config.tabs.map(tab => (
							<TabsTrigger key={tab.key} value={tab.key} className="gap-2">
								<tab.icon className="text-muted-foreground" />
								{tab.title}
							</TabsTrigger>
						))}
					</TabsList>

					<Link className={cn(buttonVariants({ variant: "green" }))} href={`/test/${result.research.id}`}>
						<RocketIcon />
						Run Tests
					</Link>
				</div>

				<TabsContent value="overview">
					<ResearchOverviewPage {...result} />
				</TabsContent>

				<TabsContent value="settings">
					<ResearchSettingsPage {...result} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Page
