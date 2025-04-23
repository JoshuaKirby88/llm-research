import { BlockingVariableCombinationT, DependentValueT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestModelBatchT, TestT, TestToBlockingValueT } from "@/src/schemas"
import { IndependentValueCollapsible } from "./independent-value-collapsible"

type Props = {
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariableCombinations: BlockingVariableCombinationT[]
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	testModelBatch: TestModelBatchT
	tests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
}

export const TestModelBatchTabContent = (props: Props) => {
	const testModelBatchTests = props.tests.filter(t => t.testModelBatchId === props.testModelBatch.id)

	return props.independentValues.map(independentValue => (
		<IndependentValueCollapsible
			key={independentValue.id}
			independentVariable={props.independentVariable}
			independentValue={independentValue}
			blockingVariableCombinations={props.blockingVariableCombinations}
			dependentValues={props.dependentValues}
			messagePrompts={props.messagePrompts}
			testModelBatch={props.testModelBatch}
			testModelBatchTests={testModelBatchTests}
			testToBlockingValues={props.testToBlockingValues}
			messages={props.messages}
		/>
	))
}
