import { LinkButton } from "@/components/buttons/link-button"
import { ResearchStarButton } from "@/components/buttons/research-star-button"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { Button, buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkService } from "@/src/services/clerk.service"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { and, desc, eq } from "drizzle-orm"
import { CogIcon, FlaskConicalIcon, GitForkIcon, RocketIcon, ShapesIcon, SquareStackIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { ResearchOverviewPage } from "./_components/overview/research-overview-page"
import { RunTestSheet } from "./_components/run-test-sheet/run-test-sheet"
import { ResearchSettingsPage } from "./_components/settings/research-settings-page"
import { TestRunPage } from "./_components/test-runs/test-run-page"

const config = {
	tabs: {
		isCurrentUser: [
			{ value: "Overview", icon: FlaskConicalIcon },
			{ value: "Test Runs", icon: SquareStackIcon },
			{ value: "Result", icon: ShapesIcon },
			{ value: "Settings", icon: CogIcon },
		],
		isOtherUser: [
			{ value: "Overview", icon: FlaskConicalIcon },
			{ value: "Test Runs", icon: SquareStackIcon },
			{ value: "Result", icon: ShapesIcon },
		],
	},
} as const

const Page = Suspense(async (props: { params: Promise<NextParam<"currentUserId" | "researchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")
	const tabs = config.tabs[params.currentUserId === user.userId ? "isCurrentUser" : "isOtherUser"]

	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(params.researchId)), ResearchRepo.getPublicWhere({ userId: user.userId })),
		with: {
			forkedResearch: true,
			contributors: true,
			userToStarredResearches: user.userId ? { where: eq(UserToStarredResearch.userId, user.userId) } : { limit: 0 },
			independentVariable: {
				with: { independentValues: true },
			},
			blockingVariables: {
				with: { blockingValues: true },
			},
			messagePrompts: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				with: {
					testModelBatches: {
						with: { testModelBatchResults: true },
					},
					testBatchResults: true,
				},
				orderBy: desc(TestBatch.id),
			},
		},
	})

	if (!result) {
		notFound()
	}

	const [
		[research],
		{
			forkedResearch: forkedResearches,
			contributors,
			userToStarredResearches,
			independentVariable: [independentVariable],
			independentValues,
			blockingVariables,
			blockingValues,
			messagePrompts,
			evalPrompt: [evalPrompt],
			dependentValues,
			testBatches,
			testModelBatches,
			testModelBatchResults,
			testBatchResults,
		},
	] = destructureArray([result], {
		forkedResearch: true,
		contributors: true,
		userToStarredResearches: true,
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
		messagePrompts: true,
		evalPrompt: true,
		dependentValues: true,
		testBatches: { testModelBatches: { testModelBatchResults: true }, testBatchResults: true },
	})

	const forkedResearch = forkedResearches.at(0)
	const userToStarredResearch = userToStarredResearches.at(0)

	const queriedUsers = await ClerkService.queryUsers(contributors.map(c => c.userId))
	const currentUser = queriedUsers.find(queriedUser => params.currentUserId === queriedUser.id)

	return (
		<div className="mx-auto w-full max-w-4xl">
			<PageTabs tabs={tabs} searchParams={searchParams}>
				<div className="flex items-start gap-5">
					<PageTabsList tabs={tabs} />

					<div className="flex items-center gap-5">
						<LinkButton href={`/new/${research.id}`} disabled={!user.userId} className={buttonVariants({ variant: "blue" })}>
							<GitForkIcon />
							Fork Research
						</LinkButton>

						<RunTestSheet user={user} research={research} independentValues={independentValues} blockingVariables={blockingVariables} blockingValues={blockingValues}>
							<Button variant="green" disabled={!user.userId}>
								<RocketIcon />
								Run Tests
							</Button>
						</RunTestSheet>

						<ResearchStarButton research={research} userToStarredResearch={userToStarredResearch} />
					</div>
				</div>

				<TabsContent value="Overview">
					<ResearchOverviewPage
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

				<TabsContent value="Result"></TabsContent>

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
