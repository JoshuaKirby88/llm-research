import { AIModel } from "@/src/features"
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
	model: AIModel
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariableCombinations: BlockingVariableCombinationT[]
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	testModelBatches: TestModelBatchT[]
	tests: TestT[]
	testToBlockingValues: TestToBlockingValueT[]
	messages: MessageT[]
	evals: EvalT[]
}

export const TestModelTabContent = (props: Props) => {
	const filteredTestModelBatches = props.testModelBatches.filter(tmb => tmb.model === props.model)
	const testModelBatchIds = filteredTestModelBatches.map(tmb => tmb.id)
	const filteredTests = props.tests.filter(test => testModelBatchIds.includes(test.testModelBatchId))
	const testIds = filteredTests.map(test => test.id)
	const filteredTestToBlockingValues = props.testToBlockingValues.filter(ttbv => testIds.includes(ttbv.testId))
	const filteredMessages = props.messages.filter(message => testIds.includes(message.testId))
	const filteredEvals = props.evals.filter(evaluation => testIds.includes(evaluation.testId))

	return (
		<div className="space-y-4">
			{props.independentValues.map(independentValue => (
				<IndependentValueCollapsible
					key={independentValue.id}
					independentVariable={props.independentVariable}
					independentValue={independentValue}
					blockingVariableCombinations={props.blockingVariableCombinations}
					dependentValues={props.dependentValues}
					messagePrompts={props.messagePrompts}
					evalPrompt={props.evalPrompt}
					testModelBatches={filteredTestModelBatches}
					tests={filteredTests}
					testToBlockingValues={filteredTestToBlockingValues}
					messages={filteredMessages}
					evals={filteredEvals}
				/>
			))}
		</div>
	)
}
