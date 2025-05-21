import { AIIcons } from "@/components/icons/ai-icons"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { AIFeature } from "@/src/features"
import { ResearchRepo } from "@/src/repos"
import { VariableTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { TestModelBatchTabContent } from "./_components/test-model-batch-tab-content"

const config = {
	tabName: "modelTab",
}

const Page = async (props: { params: Promise<NextParam<"researchId" | "testBatchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(params.researchId)), ResearchRepo.getPublicWhere({ userId: user.userId })),
		with: {
			independentVariable: { with: { independentValues: true } },
			blockingVariables: { with: { blockingValues: true } },
			messagePrompts: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				columns: {},
				where: eq(TestBatch.id, Number.parseInt(params.testBatchId)),
				with: {
					testModelBatches: {
						with: {
							tests: {
								with: {
									testToBlockingValues: true,
									messages: true,
									evals: true,
								},
							},
						},
					},
				},
			},
		},
	})

	if (!result) {
		notFound()
	}

	const [
		research,
		{
			independentVariable: [independentVariable],
			independentValues,
			blockingVariables,
			blockingValues,
			messagePrompts,
			evalPrompt: [evalPrompt],
			dependentValues,
			testBatches,
			testModelBatches,
			tests,
			testToBlockingValues,
			messages,
			evals,
		},
	] = destructureArray([result], {
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
		messagePrompts: true,
		evalPrompt: true,
		dependentValues: true,
		testBatches: { testModelBatches: { tests: { testToBlockingValues: true, messages: true, evals: true } } },
	})

	const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables, blockingValues })

	const tabs = testModelBatches.map(testModelBatch => ({
		value: testModelBatch.model,
		iconNode: <AIIcons aiProvider={AIFeature.modelToProvider(testModelBatch.model)} className="size-4.5" />,
	}))

	return (
		<div className="w-full">
			<PageTabs tabs={tabs} searchParams={searchParams} name={config.tabName}>
				<PageTabsList tabs={tabs} name={config.tabName} />

				{testModelBatches.map(testModelBatch => (
					<TabsContent key={testModelBatch.id} value={testModelBatch.model} className="space-y-4">
						<TestModelBatchTabContent
							independentVariable={independentVariable}
							independentValues={independentValues}
							blockingVariableCombinations={blockingVariableCombinations}
							dependentValues={dependentValues}
							messagePrompts={messagePrompts}
							evalPrompt={evalPrompt!}
							testModelBatch={testModelBatch}
							tests={tests}
							testToBlockingValues={testToBlockingValues}
							messages={messages}
							evals={evals}
						/>
					</TabsContent>
				))}
			</PageTabs>
		</div>
	)
}

export default Page
