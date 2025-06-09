import { LinkButton } from "@/components/buttons/link-button"
import { ResearchStarButton } from "@/components/buttons/research-star-button"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { ClerkPublicUser, TestBatchT } from "@/src/schemas"
import { authProcedure } from "@/utils/auth-procedure"
import { CogIcon, FlaskConicalIcon, GitForkIcon, RocketIcon, ShapesIcon, SquareStackIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { ResearchOverviewPage } from "./_components/overview/research-overview-page"
import { ResearchResultPage } from "./_components/result/research-result-page"
import { ResearchSettingsPage } from "./_components/settings/research-settings-page"
import { TestRunPage } from "./_components/test-runs/test-run-page"
import { researchPageQuery } from "./_queries/research-page-query"

const config = {
	getTabs(input: { params: NextParam<"currentUserId">; user: ClerkPublicUser; testBatches: TestBatchT[] }) {
		return [
			{ value: "Overview", icon: FlaskConicalIcon },
			{ value: "Test Runs", icon: SquareStackIcon },
			...(input.testBatches.length ? [{ value: "Result", icon: ShapesIcon }] : []),
			...(input.params.currentUserId === input.user.userId ? [{ value: "Settings", icon: CogIcon }] : []),
		]
	},
}

const Page = Suspense(async (props: { params: Promise<NextParam<"currentUserId" | "researchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const {
		research,
		forkedResearch,
		contributors,
		userToStarredResearch,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messageTemplates,
		evalPrompt,
		dependentValues,
		testBatches,
		testModelBatches,
		testModelBatchResults,
		testBatchResults,
		queriedUsers,
		currentUser,
	} = await researchPageQuery({ params, user })

	if (!research) {
		notFound()
	}

	const tabs = config.getTabs({ params, user, testBatches })

	return (
		<div className="mx-auto mb-20 w-full max-w-5xl">
			<PageTabs tabs={tabs} searchParams={searchParams}>
				<div className="flex items-start gap-5">
					<PageTabsList tabs={tabs} />

					<div className="flex items-center gap-5">
						<LinkButton href={`/new/${research.id}`} disabled={!user.userId} className={buttonVariants({ variant: "blue" })}>
							<GitForkIcon />
							Fork Research
						</LinkButton>

						<LinkButton href={`/user/${params.currentUserId}/research/${params.researchId}/run-test`} disabled={!user.userId} className={buttonVariants({ variant: "green" })}>
							<RocketIcon />
							Run Test
						</LinkButton>

						<ResearchStarButton user={user} research={research} userToStarredResearch={userToStarredResearch} />
					</div>
				</div>

				<TabsContent value="Overview">
					<ResearchOverviewPage
						user={user}
						currentUser={currentUser}
						research={research}
						forkedResearch={forkedResearch}
						contributors={contributors}
						independentVariable={independentVariable}
						independentValues={independentValues}
						blockingVariables={blockingVariables}
						blockingValues={blockingValues}
						dependentValues={dependentValues}
						testBatchResults={testBatchResults}
					/>
				</TabsContent>

				<TabsContent value="Test Runs">
					<TestRunPage
						searchParams={searchParams}
						params={params}
						queriedUsers={queriedUsers}
						research={research}
						contributors={contributors}
						testBatches={testBatches}
						testModelBatches={testModelBatches}
						dependentValues={dependentValues}
						testBatchResults={testBatchResults}
					/>
				</TabsContent>

				{testBatches.length > 0 && (
					<TabsContent value="Result">
						<ResearchResultPage research={research} dependentValues={dependentValues} testBatchResults={testBatchResults} />
					</TabsContent>
				)}

				{params.currentUserId === user.userId && (
					<TabsContent value="Settings">
						<ResearchSettingsPage research={research} dependentValues={dependentValues} testBatches={testBatches} />
					</TabsContent>
				)}
			</PageTabs>
		</div>
	)
})

export default Page
