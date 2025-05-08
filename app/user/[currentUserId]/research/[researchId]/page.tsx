import { LinkButton } from "@/components/link-button"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Button, buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ResearchT } from "@/src/schemas"
import { ClerkPublicUser, ClerkService } from "@/src/services/clerk.service"
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
	tabs: (input: { research: ResearchT; user: ClerkPublicUser }) => [
		{ value: "Overview", icon: FlaskConicalIcon },
		{ value: "Test Runs", icon: SquareStackIcon },
		{ value: "Result", icon: ShapesIcon },
		...(input.research.userId === input.user.userId ? [{ value: "Settings", icon: CogIcon }] : []),
	],
} as const

const Page = async (props: { params: Promise<NextParam<"researchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(params.researchId)), ResearchRepo.getPublicWhere({ userId: user.userId })),
		with: {
			forkedResearch: true,
			contributors: true,
			independentVariable: {
				with: {
					independentValues: true,
				},
			},
			blockingVariables: {
				with: {
					blockingValues: true,
				},
			},
			messagePrompts: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				with: {
					testModelBatches: {
						with: {
							tests: {
								with: {
									messages: true,
									testToBlockingValues: true,
								},
							},
							testModelBatchResults: true,
						},
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

	const {
		forkedResearch,
		contributors,
		independentVariable: _independentVariable,
		blockingVariables: blockingVariablesWithValues,
		messagePrompts,
		evalPrompt,
		dependentValues,
		testBatches: _testBatches,
		...research
	} = result
	const { independentValues, ...independentVariable } = _independentVariable!
	const [blockingVariables, { blockingValues }] = destructureArray(blockingVariablesWithValues, { blockingValues: true })
	const [testBatches, { testBatchResults, testModelBatches, testModelBatchResults, tests, messages, testToBlockingValues }] = destructureArray(_testBatches, {
		testModelBatches: { tests: { messages: true, testToBlockingValues: true }, testModelBatchResults: true },
		testBatchResults: true,
	})

	const queriedUsers = await ClerkService.queryUsers(contributors.map(c => c.userId))
	const currentUser = queriedUsers.find(queriedUser => research.userId === queriedUser.id)

	return (
		<div className="mx-auto w-full max-w-4xl">
			<PageTabs tabs={config.tabs({ research, user })} searchParams={searchParams}>
				<div className="mb-10 flex items-center gap-5">
					<PageTabsList tabs={config.tabs({ research, user })} className="mb-0" />

					<LinkButton href={`/new/${research.id}`} disabled={!user.userId} className={buttonVariants({ variant: "blue" })}>
						<GitForkIcon />
						Fork Research
					</LinkButton>

					<RunTestSheet user={user} research={research} independentValues={independentValues} blockingVariablesWithValues={blockingVariablesWithValues}>
						<Button variant="green" disabled={!user.userId}>
							<RocketIcon />
							Run Tests
						</Button>
					</RunTestSheet>
				</div>

				<TabsContent value="Overview">
					<ResearchOverviewPage
						currentUser={currentUser}
						research={research}
						forkedResearch={forkedResearch}
						contributors={contributors}
						dependentValues={dependentValues}
						testBatchResults={testBatchResults}
					/>
				</TabsContent>

				<TabsContent value="Test Runs">
					<TestRunPage
						searchParams={searchParams}
						user={user}
						queriedUsers={queriedUsers}
						research={research}
						contributors={contributors}
						testBatches={testBatches}
						testModelBatches={testModelBatches}
						dependentValues={dependentValues}
						testBatchResults={testBatchResults}
					/>
				</TabsContent>

				{/* TODO: Should I also not mount this too, or does it not matter? */}
				<TabsContent value="Settings">
					<ResearchSettingsPage research={research} dependentValues={dependentValues} testBatches={testBatches} />
				</TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
