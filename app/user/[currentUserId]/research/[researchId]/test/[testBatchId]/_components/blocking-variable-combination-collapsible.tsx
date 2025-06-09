import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessageT, MessageTemplateT, TestT, TestToBlockingValueT } from "@/src/schemas"
import { TestTable } from "@/src/tables"
import { TestCard } from "./test-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	dependentValues: DependentValueT[]
	messageTemplates: MessageTemplateT[]
	evalPrompt: EvalPromptT
	tests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const BlockingVariableCombinationCollapsible = (props: Props) => {
	const filteredTests = TestTable.byBlockingVariableCombination(props.tests, props.testToBlockingValues, props.blockingVariableCombination)

	return (
		<Collapsible className="rounded-none border-b last:border-none" disabled={!filteredTests.length}>
			<CollapsibleTrigger className="bg-transparent">
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.blockingVariableCombination.map(blockingVariableWithValue => (
						<div key={blockingVariableWithValue.id}>
							{blockingVariableWithValue.name}: {blockingVariableWithValue.blockingValue.value}
						</div>
					))}
				</div>

				<Badge size="roundSm" variant="outline" className="font-semibold">
					{filteredTests.length}
				</Badge>
			</CollapsibleTrigger>

			<CollapsibleContent className="space-y-5 p-2 pt-0">
				{filteredTests.map(test => (
					<TestCard
						key={test.id}
						independentVariable={props.independentVariable}
						independentValue={props.independentValue}
						blockingVariableCombination={props.blockingVariableCombination}
						dependentValues={props.dependentValues}
						messageTemplates={props.messageTemplates}
						evalPrompt={props.evalPrompt}
						test={test}
						messages={props.messages}
						evals={props.evals}
					/>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}
