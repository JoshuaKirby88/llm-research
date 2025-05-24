import { starResearchAction, unstarResearchAction } from "@/actions/research/star-research.action"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { LinkButton } from "@/components/link-button"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Button, buttonVariants } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkService } from "@/src/services/clerk.service"
import { authProcedure } from "@/utils/auth-procedure"
import { cn } from "@/utils/cn"
import { destructureArray } from "@/utils/destructure-array"
import { and, desc, eq } from "drizzle-orm"
import { CogIcon, FlaskConicalIcon, GitForkIcon, RocketIcon, ShapesIcon, SquareStackIcon, StarIcon } from "lucide-react"
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

const Page = async (props: { params: Promise<NextParam<"currentUserId" | "researchId">>; searchParams: Promise<NextSearchParam> }) => {
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
			forkedResearch: [forkedResearch],
			contributors,
			userToStarredResearches: [userToStarredResearch],
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

	const queriedUsers = await ClerkService.queryUsers(contributors.map(c => c.userId))
	const currentUser = queriedUsers.find(queriedUser => params.currentUserId === queriedUser.id)

	return (
		<div className="mx-auto w-full max-w-4xl">
			<PageTabs tabs={tabs} searchParams={searchParams}>
				<div className="flex gap-5">
					<PageTabsList tabs={tabs} />

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

					<FormActionButton
						as="button"
						action={(userToStarredResearch ? unstarResearchAction : starResearchAction).bind(null, { researchId: research.id, currentUserId: research.userId })}
						className="flex h-9 items-center gap-2"
					>
						<StarIcon className={cn(userToStarredResearch && "fill-yellow-400 text-yellow-400")} /> {research.starCount}
					</FormActionButton>
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
}

export default Page
