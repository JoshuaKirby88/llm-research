import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ClerkPublicUser, ClerkQueriedUser } from "@/src/schemas"
import { ArchiveIcon, FlaskConicalIcon, GlobeIcon, NotebookPenIcon, StarIcon } from "lucide-react"
import { userResearchPageQuery } from "../../_queries/user-research-page-query"
import { UserResearchTabPage } from "./user-research-tab-page"

const config = {
	tabName: "researchTab",
	getTabs(input: { params: NextParam<"currentUserId">; user: ClerkPublicUser }) {
		if (input.params.currentUserId === input.user.userId) {
			return [
				{ value: "All", icon: FlaskConicalIcon },
				{ value: "Published", icon: GlobeIcon },
				{ value: "Researching", icon: NotebookPenIcon },
				{ value: "Starred", icon: StarIcon },
				{ value: "Archived", icon: ArchiveIcon },
			]
		} else {
			return [
				{ value: "Published", icon: GlobeIcon },
				{ value: "Starred", icon: StarIcon },
			]
		}
	},
}

export const UserResearchPage = (
	props: { params: NextParam<"currentUserId">; searchParams: NextSearchParam; user: ClerkPublicUser; queriedUsers: ClerkQueriedUser[] } & Return<typeof userResearchPageQuery>,
) => {
	const tabs = config.getTabs({ params: props.params, user: props.user })

	return (
		<PageTabs tabs={tabs} name={config.tabName} searchParams={props.searchParams} orientation="vertical">
			<PageTabsList tabs={tabs} name={config.tabName} />

			{tabs.map(tab => {
				const filteredResearches = props.researches.filter(
					r =>
						(tab.value === "All" && !r.isArchived) ||
						(tab.value === "Published" && !r.isArchived && r.isPublished) ||
						(tab.value === "Researching" && !r.isArchived && !r.isPublished) ||
						(tab.value === "Starred" && r.isStarredByUser) ||
						(tab.value === "Archived" && r.isArchived),
				)

				return (
					<TabsContent key={tab.value} value={tab.value} className="space-y-10">
						<UserResearchTabPage
							user={props.user}
							queriedUsers={props.queriedUsers}
							researches={filteredResearches}
							userToStarredResearches={props.userToStarredResearches}
							dependentValues={props.dependentValues}
							testBatches={props.testBatches}
							testBatchResults={props.testBatchResults}
						/>
					</TabsContent>
				)
			})}
		</PageTabs>
	)
}
