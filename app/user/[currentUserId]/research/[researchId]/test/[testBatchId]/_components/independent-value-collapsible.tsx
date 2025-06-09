import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	BlockingVariableCombinationT,
	DependentValueT,
	EvalPromptT,
	EvalT,
	IndependentValueT,
	IndependentVariableT,
	MessageT,
	MessageTemplateT,
	TestModelBatchT,
	TestT,
	TestToBlockingValueT,
} from "@/src/schemas"
import { BlockingVariableCombinationCollapsible } from "./blocking-variable-combination-collapsible"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombinations: BlockingVariableCombinationT[]
	dependentValues: DependentValueT[]
	messageTemplates: MessageTemplateT[]
	evalPrompt: EvalPromptT
	testModelBatches: TestModelBatchT[]
	tests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const IndependentValueCollapsible = (props: Props) => {
	const filteredTests = props.tests.filter(test => test.independentValueId === props.independentValue.id)
	const testIds = filteredTests.map(test => test.id)
	const filteredTestToBlockingValues = props.testToBlockingValues.filter(ttbv => testIds.includes(ttbv.testId))
	const filteredMessages = props.messages.filter(message => testIds.includes(message.testId))
	const filteredEvals = props.evals.filter(evaluation => testIds.includes(evaluation.testId))

	return (
		<Collapsible className="border" defaultOpen={!!filteredTests.length} disabled={!filteredTests.length}>
			<CollapsibleTrigger>
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.independentVariable.name}: {props.independentValue.value}
				</div>

				<Badge size="roundSm" variant="outline" className="font-semibold">
					{filteredTests.length}
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
						messageTemplates={props.messageTemplates}
						evalPrompt={props.evalPrompt}
						tests={filteredTests}
						testToBlockingValues={filteredTestToBlockingValues}
						messages={filteredMessages}
						evals={filteredEvals}
					/>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}
