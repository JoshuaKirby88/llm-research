import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestT } from "@/src/schemas"
import { MessageCard } from "./message-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	test: TestT
	messages: MessageT[]
	evals: EvalT[]
}

export const TestCard = (props: Props) => {
	const filteredMessages = props.messages.filter(m => m.testId === props.test.id)
	const evaluation = props.evals.find(e => e.testId === props.test.id)!
	const dependentValue = props.dependentValues.find(dVal => dVal.id === props.test.dependentValueId)!

	const totalInputTokens = filteredMessages.reduce((acc, curr) => acc + curr.promptTokens, evaluation.promptTokens)
	const totalOutputTokens = filteredMessages.reduce((acc, curr) => acc + curr.completionTokens, evaluation.completionTokens)

	return (
		<Card size="sm">
			<CardHeader>
				Total Input Tokens: {totalInputTokens}, Total Output Tokens: {totalOutputTokens}
			</CardHeader>

			<CardContent className="space-y-4">
				{filteredMessages.map(message => (
					<MessageCard
						key={message.id}
						independentVariable={props.independentVariable}
						independentValue={props.independentValue}
						blockingVariableCombination={props.blockingVariableCombination}
						dependentValue={dependentValue}
						messages={filteredMessages}
						message={message}
						messagePrompts={props.messagePrompts}
					/>
				))}

				<Separator className="my-5" />

				<MessageCard
					independentVariable={props.independentVariable}
					independentValue={props.independentValue}
					blockingVariableCombination={props.blockingVariableCombination}
					dependentValue={dependentValue}
					messages={filteredMessages}
					eval={evaluation}
					evalPrompt={props.evalPrompt}
				/>
			</CardContent>
		</Card>
	)
}
