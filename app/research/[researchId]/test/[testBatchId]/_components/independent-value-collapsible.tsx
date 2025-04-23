import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BlockingVariableCombinationT, DependentValueT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestModelBatchT, TestT, TestToBlockingValueT } from "@/src/schemas"
import { TestTable } from "@/src/tables/test.table"
import { BlockingVariableCombinationCollapsible } from "./blocking-variable-combination-collapsible"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombinations: BlockingVariableCombinationT[]
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	testModelBatch: TestModelBatchT
	testModelBatchTests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
}

export const IndependentValueCollapsible = (props: Props) => {
	const testsByIndependentValue = props.testModelBatchTests.filter(test => test.independentValueId === props.independentValue.id)
	const testsByIndependentValueTestIds = testsByIndependentValue.map(test => test.id)
	const testToBlockingValuesByIndependentValue = props.testToBlockingValues.filter(ttbv => testsByIndependentValueTestIds.includes(ttbv.testId))
	const testsByBlockingVariableCombinations = TestTable.byCombination(testsByIndependentValue, testToBlockingValuesByIndependentValue, props.blockingVariableCombinations)

	return (
		<Collapsible key={props.independentValue.id} className="overflow-hidden rounded-xl border">
			<CollapsibleTrigger className="group flex w-full items-center justify-between bg-muted p-4">
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.independentVariable.name}: {props.independentValue.value}
				</div>

				<Badge size="roundSm" variant="outline">
					{props.testModelBatch.testCount}
				</Badge>
			</CollapsibleTrigger>

			<CollapsibleContent>
				{props.blockingVariableCombinations.map((blockingVariableCombination, i) => (
					<BlockingVariableCombinationCollapsible
						key={i}
						independentVariable={props.independentVariable}
						independentValue={props.independentValue}
						blockingVariableCombination={blockingVariableCombination}
						dependentValues={props.dependentValues}
						messagePrompts={props.messagePrompts}
						testsByBlockingVariableCombinations={testsByBlockingVariableCombinations}
						messages={props.messages}
					/>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}
