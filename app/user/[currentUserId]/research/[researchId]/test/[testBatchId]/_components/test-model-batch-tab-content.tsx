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
import { IndependentValueCollapsible } from "./independent-value-collapsible"

type Props = {
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariableCombinations: BlockingVariableCombinationT[]
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	testModelBatch: TestModelBatchT
	tests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const TestModelBatchTabContent = (props: Props) => {
	const testModelBatchTests = props.tests.filter(test => test.testModelBatchId === props.testModelBatch.id)

	return props.independentValues.map(independentValue => (
		<IndependentValueCollapsible
			key={independentValue.id}
			independentVariable={props.independentVariable}
			independentValue={independentValue}
			blockingVariableCombinations={props.blockingVariableCombinations}
			dependentValues={props.dependentValues}
			messagePrompts={props.messagePrompts}
			evalPrompt={props.evalPrompt}
			testModelBatch={props.testModelBatch}
			testModelBatchTests={testModelBatchTests}
			testToBlockingValues={props.testToBlockingValues}
			messages={props.messages}
			evals={props.evals}
		/>
	))
}
