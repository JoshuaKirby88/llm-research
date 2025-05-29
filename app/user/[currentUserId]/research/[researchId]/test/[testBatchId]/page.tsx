import { DownloadFileButton } from "@/components/download-file-button"
import { AIIcons } from "@/components/icons/ai-icons"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { AIFeature } from "@/src/features"
import { ResearchRepo } from "@/src/repos"
import { ClerkService } from "@/src/services/clerk.service"
import { VariableTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { deDupe } from "@/utils/de-dupe"
import { destructureArray } from "@/utils/destructure-array"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { TestFilter } from "./_components/test-filter/test-filter"
import { testFilterToDrizzle } from "./_components/test-filter/test-filter-to-drizzle"
import { TestModelTabContent } from "./_components/test-model-tab-content"

const config = {
	tabName: "modelTab",
}

const Page = async (props: { params: Promise<NextParam<"researchId" | "testBatchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const { testBatchFilters, testFilters, testToBlockingValueFilters } = testFilterToDrizzle({ params, searchParams })

	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(params.researchId)), ResearchRepo.getPublicWhere({ userId: user.userId })),
		with: {
			contributors: true,
			independentVariable: { with: { independentValues: true } },
			blockingVariables: { with: { blockingValues: true } },
			messagePrompts: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				where: testBatchFilters,
				with: {
					testModelBatches: {
						with: {
							tests: {
								where: testFilters,
								with: {
									testToBlockingValues: {
										where: testToBlockingValueFilters,
									},
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
		[research],
		{
			contributors,
			independentVariable: [independentVariable],
			independentValues,
			blockingVariables,
			blockingValues,
			messagePrompts,
			evalPrompt: [evalPrompt],
			dependentValues,
			testModelBatches,
			tests: _tests,
			testToBlockingValues,
			messages,
			evals,
		},
	] = destructureArray([result], {
		contributors: true,
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
		messagePrompts: true,
		evalPrompt: true,
		dependentValues: true,
		testBatches: { testModelBatches: { tests: { testToBlockingValues: true, messages: true, evals: true } } },
	})

	const testToBlockingValueTestIds = testToBlockingValues.map(ttbv => ttbv.testId)
	const tests = _tests.filter(t => testToBlockingValueTestIds.includes(t.id))

	const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables, blockingValues })

	const queriedUsers = await ClerkService.queryUsers(
		contributors.map(c => c.userId),
		{ serialize: true },
	)

	const models = deDupe(testModelBatches, "model").map(tmb => tmb.model)

	const tabs = models.map(model => {
		const testModelBatchIds = testModelBatches.filter(tmb => tmb.model === model).map(tmb => tmb.id)
		return {
			value: model,
			iconNode: <AIIcons aiProvider={AIFeature.modelToProvider(model)} className="size-4.5" />,
			badge: tests.filter(t => testModelBatchIds.includes(t.testModelBatchId)).length,
		}
	})

	return (
		<div className="w-full">
			<PageTabs tabs={tabs} searchParams={searchParams} name={config.tabName}>
				<div className="mb-1 flex gap-5">
					<TestFilter
						params={params}
						queriedUsers={queriedUsers}
						contributors={contributors}
						independentVariable={independentVariable}
						independentValues={independentValues}
						blockingVariables={blockingVariables}
						blockingValues={blockingValues}
						dependentValues={dependentValues}
					/>

					<DownloadFileButton data={JSON.stringify(result, null, 2)} fileName={`research-${research.id}_tests.json`} />
				</div>

				<PageTabsList tabs={tabs} name={config.tabName} />

				{models.map(model => (
					<TabsContent key={model} value={model}>
						<TestModelTabContent
							model={model}
							independentVariable={independentVariable}
							independentValues={independentValues}
							blockingVariableCombinations={blockingVariableCombinations}
							dependentValues={dependentValues}
							messagePrompts={messagePrompts}
							evalPrompt={evalPrompt}
							testModelBatches={testModelBatches}
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
