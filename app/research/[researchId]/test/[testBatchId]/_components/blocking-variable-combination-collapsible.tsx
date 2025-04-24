import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestT, TestToBlockingValueT } from "@/src/schemas"
import { TestTable } from "@/src/tables/test.table"
import { TestCard } from "./test-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	testsByIndependentValue: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const BlockingVariableCombinationCollapsible = (props: Props) => {
	const testsByIndependentValueTestIds = props.testsByIndependentValue.map(test => test.id)
	const testToBlockingValuesByIndependentValue = props.testToBlockingValues.filter(ttbv => testsByIndependentValueTestIds.includes(ttbv.testId))
	const testsByBlockingVariableCombination = TestTable.byCombination(props.testsByIndependentValue, testToBlockingValuesByIndependentValue, props.blockingVariableCombination)

	return (
		<Collapsible className="rounded-none border-b last:border-none">
			<CollapsibleTrigger className="bg-transparent">
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.blockingVariableCombination.map(blockingVariableCombination => (
						<div key={blockingVariableCombination.id}>
							{blockingVariableCombination.name}: {blockingVariableCombination.blockingValue.value}
						</div>
					))}
				</div>

				<Badge size="roundSm" variant="outline">
					{testsByBlockingVariableCombination.length}
				</Badge>
			</CollapsibleTrigger>

			<CollapsibleContent className="space-y-5 p-2 pt-0">
				{testsByBlockingVariableCombination.map(test => (
					<TestCard
						key={test.id}
						independentVariable={props.independentVariable}
						independentValue={props.independentValue}
						blockingVariableCombination={props.blockingVariableCombination}
						dependentValues={props.dependentValues}
						messagePrompts={props.messagePrompts}
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
