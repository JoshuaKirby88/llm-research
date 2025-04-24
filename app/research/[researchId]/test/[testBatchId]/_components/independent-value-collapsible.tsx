import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	BlockingVariableCombinationT,
	DependentValueT,
	EvalPromptT,
	EvalT,
	IndependentValueT,
	IndependentVariableT,
	MessagePromptT,
	MessageT,
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
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	testModelBatch: TestModelBatchT
	testModelBatchTests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const IndependentValueCollapsible = (props: Props) => {
	return (
		<Collapsible key={props.independentValue.id} className="border">
			<CollapsibleTrigger>
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.independentVariable.name}: {props.independentValue.value}
				</div>

				<Badge size="roundSm" variant="outline">
					{props.blockingVariableCombinations.length}
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
						evalPrompt={props.evalPrompt}
						testModelBatchTests={props.testModelBatchTests}
						testToBlockingValues={props.testToBlockingValues}
						messages={props.messages}
						evals={props.evals}
					/>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}
