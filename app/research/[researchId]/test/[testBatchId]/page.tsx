import { AIIcons } from "@/components/icons/ai-icons"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { AIFeature } from "@/src/features"
import { VariableTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { TestModelBatchTabContent } from "./_components/test-model-batch-tab-content"

const Page = async (props: { params: Promise<{ researchId: string; testBatchId: string }>; searchParams: NextSearchParams }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	await authProcedure("signedIn")

	const result = await db.query.Research.findFirst({
		where: eq(Research.id, Number.parseInt(params.researchId)),
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

	if (!result || !result.testBatches[0]) {
		notFound()
	}

	const { independentVariable: _independentVariable, blockingVariables: blockingVariablesWithValues, messagePrompts, evalPrompt, dependentValues, testBatches } = result
	const { independentValues, ...independentVariable } = _independentVariable!
	const [_, { testModelBatches, tests, testToBlockingValues, messages, evals }] = destructureArray(testBatches, {
		testModelBatches: { tests: { testToBlockingValues: true, messages: true, evals: true } },
	})

	const blockingVariableCombinations = VariableTable.createCombination(blockingVariablesWithValues)

	const tabs = testModelBatches.map(testModelBatch => ({
		key: testModelBatch.model,
		title: testModelBatch.model,
		iconNode: <AIIcons aiProvider={AIFeature.modelToProvider(testModelBatch.model)} className="size-4.5" />,
	}))

	return (
		<div className="w-full">
			<PageTabs tabs={tabs} searchParams={searchParams} name="model">
				<PageTabsList tabs={tabs} name="model" />

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
