import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BlockingVariableCombinationT, DependentValueT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestT } from "@/src/schemas"
import { MessageCard } from "./message-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	dependentValues: DependentValueT[]
	blockingVariableCombination: BlockingVariableCombinationT
	messagePrompts: MessagePromptT[]
	test: TestT
	messages: MessageT[]
}

export const TestCard = (props: Props) => {
	const testMessages = props.messages.filter(m => m.testId === props.test.id)
	const dependentValue = props.dependentValues.find(dv => dv.id === props.test.dependentValueId)!
	const totalInputTokens = props.messages.reduce((acc, curr) => acc + curr.promptTokens, 0)
	const totalOutputTokens = props.messages.reduce((acc, curr) => acc + curr.completionTokens, 0)

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
							messages={props.messages}
							message={message}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
