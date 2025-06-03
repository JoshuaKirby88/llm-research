import { DownloadFileButton } from "@/components/buttons/download-file-button"
import { AIIcons } from "@/components/icons/ai-icons"
import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { TabsContent } from "@/components/ui/tabs"
import { AIFeature, AIModel } from "@/src/features"
import { TestModelBatchT, TestT } from "@/src/schemas"
import { authProcedure } from "@/utils/auth-procedure"
import { notFound } from "next/navigation"
import { TestFilter } from "./_components/test-filter/test-filter"
import { TestModelTabContent } from "./_components/test-model-tab-content"
import { testPageQuery } from "./_queries/test-page-query"

const config = {
	tabName: "modelTab",
	getTabs(input: { models: AIModel[]; tests: TestT[]; testModelBatches: TestModelBatchT[] }) {
		return input.models.map(model => {
			const testModelBatchIds = input.testModelBatches.filter(tmb => tmb.model === model).map(tmb => tmb.id)
			return {
				value: model,
				iconNode: <AIIcons aiProvider={AIFeature.modelToProvider(model)} className="size-4.5" />,
				badge: input.tests.filter(t => testModelBatchIds.includes(t.testModelBatchId)).length,
			}
		})
	},
}

const Page = Suspense(async (props: { params: Promise<NextParam<"researchId" | "testBatchId">>; searchParams: Promise<NextSearchParam> }) => {
	const params = await props.params
	const searchParams = await props.searchParams
	const user = await authProcedure("public")

	const {
		research,
		contributors,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messagePrompts,
		evalPrompt,
		dependentValues,
		testModelBatches,
		tests,
		testToBlockingValues,
		messages,
		evals,
		blockingVariableCombinations,
		queriedUsers,
		models,
		toDownload,
	} = await testPageQuery({ params, searchParams, user })

	if (!research) {
		notFound()
	}

	const tabs = config.getTabs({ models, tests, testModelBatches })

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

					<DownloadFileButton data={JSON.stringify(toDownload, null, 2)} fileName={`research-${research.id}_tests.json`} />
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
})

export default Page
