import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Button, buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { ClerkService } from "@/src/services/clerk.service"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { desc, eq } from "drizzle-orm"
import { CogIcon, FlaskConicalIcon, GitBranchIcon, RocketIcon, ShapesIcon, SquareStackIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ResearchOverviewPage } from "./_components/overview/research-overview-page"
import { RunTestSheet } from "./_components/run-test-sheet/run-test-sheet"
import { ResearchSettingsPage } from "./_components/settings/research-settings-page"
import { TestRunPage } from "./_components/test-runs/test-run-page"

const Page = async (props: { params: Promise<{ researchId: string }>; searchParams: NextSearchParams }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("signedIn")

	const result = await db.query.Research.findFirst({
		where: eq(Research.id, Number.parseInt(params.researchId)),
		with: {
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
		return
	}

	const {
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

	const users = await ClerkService.getUsers(contributors.map(c => c.userId))
	const researchUser = users.find(user => research.userId === user.id)!

	if (!result) {
		notFound()
	}

	const config = {
		tabs: [
			{ key: "overview", title: "Overview", icon: FlaskConicalIcon },
			{ key: "testRuns", title: "Test Runs", icon: SquareStackIcon },
			{ key: "result", title: "Result", icon: ShapesIcon },
			...(research.userId === user.userId ? [{ key: "settings", title: "Settings", icon: CogIcon }] : []),
		],
	}

	return (
		<div className="mx-auto w-full max-w-4xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<div className="mb-10 flex items-center gap-5">
					<PageTabsList tabs={config.tabs} className="mb-0" />

					<Link href={`/new/${research.id}`} className={buttonVariants({ variant: "blue" })}>
						<GitBranchIcon />
						Fork Research
					</Link>

					<RunTestSheet user={user} independentValues={independentValues} blockingVariablesWithValues={blockingVariablesWithValues}>
						<Button variant="green">
							<RocketIcon />
							Run Tests
						</Button>
					</RunTestSheet>
				</div>

				<TabsContent value="overview">
					<ResearchOverviewPage researchUser={researchUser} research={research} contributors={contributors} />
				</TabsContent>

				<TabsContent value="testRuns">
					<TestRunPage searchParams={searchParams} user={user} users={users} contributors={contributors} testBatches={testBatches} testModelBatches={testModelBatches} />
				</TabsContent>

				{/* TODO: Should I also not mount this too, or does it not matter? */}
				<TabsContent value="settings">
					<ResearchSettingsPage research={research} />
				</TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
