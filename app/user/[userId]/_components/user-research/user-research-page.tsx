import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ClerkPublicUser } from "@/src/services/clerk.service"
import { authProcedure } from "@/utils/auth-procedure"
import { ArchiveIcon, CheckCircle2Icon, FlaskConicalIcon, NotebookPenIcon, StarIcon } from "lucide-react"
import { ResearchPage } from "./research-page"

export type UserResearchPageTabId = "All" | "Complete" | "Researching" | "Starred" | "Archived"

const config = {
	tabs: (input: { params: { userId: string }; user: ClerkPublicUser }) => {
		return (
			input.params.userId === input.user.userId
				? [
						{ value: "All", icon: FlaskConicalIcon },
						{ value: "Complete", icon: CheckCircle2Icon },
						{ value: "Researching", icon: NotebookPenIcon },
						{ value: "Starred", icon: StarIcon },
						{ value: "Archived", icon: ArchiveIcon },
					]
				: [
						{ value: "Complete", icon: CheckCircle2Icon },
						{ value: "Starred", icon: StarIcon },
					]
		) satisfies { value: UserResearchPageTabId; [key: string]: any }[]
	},
}

export const UserResearchPage = async (props: { params: { userId: string }; searchParams: Awaited<NextSearchParams> }) => {
	const user = await authProcedure("public")

	return (
		<div className="w-full">
			<PageTabs tabs={config.tabs({ params: props.params, user })} searchParams={props.searchParams} orientation="vertical">
				<PageTabsList tabs={config.tabs({ params: props.params, user })} />

				{config.tabs({ params: props.params, user }).map(tab => (
					<TabsContent key={tab.value} value={tab.value} className="space-y-10">
						<ResearchPage params={props.params} tab={tab.value} />
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}
