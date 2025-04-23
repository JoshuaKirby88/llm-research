import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestT } from "@/src/schemas"
import { MessageCard } from "./message-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	dependentValues: DependentValueT[]
	blockingVariableCombination: BlockingVariableCombinationT
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	test: TestT
	messages: MessageT[]
	evals: EvalT[]
}

export const TestCard = (props: Props) => {
	const testMessages = props.messages.filter(m => m.testId === props.test.id)
	const evaluation = props.evals.find(evaluation => evaluation.testId === props.test.id)!
	const dependentValue = props.dependentValues.find(dv => dv.id === props.test.dependentValueId)!
	const totalInputTokens = testMessages.reduce((acc, curr) => acc + curr.promptTokens, evaluation.promptTokens)
	const totalOutputTokens = testMessages.reduce((acc, curr) => acc + curr.completionTokens, evaluation.completionTokens)

	return (
		<Card className="border" padding="sm">
			<CardHeader>
				Result: {dependentValue.value}
				<br />
				Tokens: Input: {totalInputTokens}, Output: {totalOutputTokens}
				<br />
				Independent Variable: {props.independentValue.value}
				<br />
				Blocking Variables: {props.blockingVariableCombination.map(bvc => `${bvc.name}: ${bvc.blockingValue.value}`).join(", ")}
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{testMessages.map(message => (
						<MessageCard
							key={message.id}
							independentVariable={props.independentVariable}
							independentValue={props.independentValue}
							blockingVariableCombination={props.blockingVariableCombination}
							messagePrompts={props.messagePrompts}
							messages={testMessages}
							message={message}
						/>
					))}

					<Separator className="my-5" />

					<MessageCard
						key={evaluation.id}
						independentVariable={props.independentVariable}
						independentValue={props.independentValue}
						blockingVariableCombination={props.blockingVariableCombination}
						evalPrompt={props.evalPrompt}
						messages={testMessages}
						eval={evaluation}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
