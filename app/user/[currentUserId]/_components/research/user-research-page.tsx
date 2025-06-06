import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/schemas"
import { ArchiveIcon, FlaskConicalIcon, GlobeIcon, NotebookPenIcon, StarIcon } from "lucide-react"
import { userResearchPageQuery, userResearchPageStarredQuery } from "../../_queries/user-research-page-query"
import { UserResearchTabPage } from "./user-research-tab-page"

type Props = {
	params: NextParam<"currentUserId">
	searchParams: NextSearchParam
	user: ClerkPublicUser
	queriedUsers: ClerkQueriedUser[]
	starred: Return<typeof userResearchPageStarredQuery>
} & Return<typeof userResearchPageQuery>

const config = {
	tabName: "researchTab",
	getTabs(input: { params: NextParam<"currentUserId">; user: ClerkPublicUser }) {
		if (input.params.currentUserId === input.user.userId) {
			return [
				{ value: "All", icon: FlaskConicalIcon },
				{ value: "Published", icon: GlobeIcon },
				{ value: "In Progress", icon: NotebookPenIcon },
				{ value: "Starred", icon: StarIcon },
				{ value: "Archived", icon: ArchiveIcon },
			] as const
		} else {
			return [
				{ value: "Published", icon: GlobeIcon },
				{ value: "Starred", icon: StarIcon },
			] as const
		}
	},
}
export type UserResearchPageConfig = typeof config

export const UserResearchPage = (props: Props) => {
	const tabs = config.getTabs({ params: props.params, user: props.user })

	return (
		<PageTabs tabs={tabs} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
			<PageTabsList tabs={tabs} name={config.tabName} />

			{tabs.map(tab => (
				<TabsContent key={tab.value} value={tab.value} className="space-y-10">
					{(() => {
						if (tab.value === "Starred") {
							return (
								<UserResearchTabPage
									tab={tab.value}
									user={props.user}
									queriedUsers={props.queriedUsers}
									researches={props.starred.researches}
									userToStarredResearches={props.starred.userToStarredResearches}
									dependentValues={props.starred.dependentValues}
									testBatches={props.starred.testBatches}
									testBatchResults={props.starred.testBatchResults}
								/>
							)
						} else {
							const filteredResearches = props.researches.filter(
								r =>
									(tab.value === "All" && !r.isArchived) ||
									(tab.value === "Published" && !r.isArchived && r.isPublished) ||
									(tab.value === "In Progress" && !r.isArchived && !r.isPublished) ||
									(tab.value === "Archived" && r.isArchived),
							)

							return (
								<UserResearchTabPage
									tab={tab.value}
									user={props.user}
									queriedUsers={props.queriedUsers}
									researches={filteredResearches}
									userToStarredResearches={props.userToStarredResearches}
									dependentValues={props.dependentValues}
									testBatches={props.testBatches}
									testBatchResults={props.testBatchResults}
								/>
							)
						}
					})()}
				</TabsContent>
			))}
		</PageTabs>
	)
}
