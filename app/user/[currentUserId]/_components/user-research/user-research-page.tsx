import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkPublicUser } from "@/src/services/clerk.service"
import { destructureArray } from "@/utils/destructure-array"
import { and, desc, eq } from "drizzle-orm"
import { ArchiveIcon, CheckCircle2Icon, FlaskConicalIcon, NotebookPenIcon, StarIcon } from "lucide-react"
import { ResearchPage } from "./research-page"

const config = {
	tabs: {
		isCurrentUser: [
			{ value: "All", icon: FlaskConicalIcon },
			{ value: "Complete", icon: CheckCircle2Icon },
			{ value: "Researching", icon: NotebookPenIcon },
			{ value: "Starred", icon: StarIcon },
			{ value: "Archived", icon: ArchiveIcon },
		],
		isOtherUser: [
			{ value: "Complete", icon: CheckCircle2Icon },
			{ value: "Starred", icon: StarIcon },
		],
	},
} as const

export const UserResearchPage = Suspense(async (props: { params: NextParam<"currentUserId">; searchParams: Awaited<NextSearchParam>; user: ClerkPublicUser }) => {
	const tabs = config.tabs[props.params.currentUserId === props.user.userId ? "isCurrentUser" : "isOtherUser"]

	const result = await db.query.Research.findMany({
		where: and(eq(Research.userId, props.params.currentUserId), ResearchRepo.getPublicWhere({ userId: props.user.userId })),
		with: {
			userToStarredResearches: props.user.userId ? { where: eq(UserToStarredResearch.userId, props.user.userId) } : { limit: 0 },
			dependentValues: true,
			testBatches: {
				with: { testBatchResults: true },
			},
		},
		orderBy: desc(Research.id),
	})

	return (
		<div className="w-full">
			<PageTabs tabs={tabs} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList tabs={tabs} />

				{tabs.map(tab => {
					const filteredResult = result.filter(
						r =>
							(tab.value === "All" && !r.isArchived) ||
							(tab.value === "Complete" && !r.isArchived && r.isComplete) ||
							(tab.value === "Researching" && !r.isArchived && !r.isComplete) ||
							(tab.value === "Starred" && r.isStarred) ||
							(tab.value === "Archived" && r.isArchived),
					)

					const [researches, { userToStarredResearches, dependentValues, testBatches, testBatchResults }] = destructureArray(filteredResult, {
						userToStarredResearches: true,
						dependentValues: true,
						testBatches: { testBatchResults: true },
					})

					return (
						<TabsContent key={tab.value} value={tab.value} className="space-y-10">
							<ResearchPage
								user={props.user}
								researches={researches}
								userToStarredResearches={userToStarredResearches}
								dependentValues={dependentValues}
								testBatches={testBatches}
								testBatchResults={testBatchResults}
							/>
						</TabsContent>
					)
				})}
			</PageTabs>
		</div>
	)
})
