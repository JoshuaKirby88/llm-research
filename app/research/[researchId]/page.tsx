import { queryResearchAction } from "@/actions/research/query-research.action"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
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

const Page = async (props: { params: Promise<{ researchId: string }>; searchParams: NextSearchParams }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const result = await actionIsValid(queryResearchAction({ researchId: Number.parseInt(params.researchId) }))

	if (!result) {
		notFound()
	}

	return (
		<div className="mx-auto w-full max-w-4xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<div className="mb-10 flex items-center gap-5">
					<PageTabsList tabs={config.tabs} className="mb-0" />

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
			</PageTabs>
		</div>
	)
}

export default Page
