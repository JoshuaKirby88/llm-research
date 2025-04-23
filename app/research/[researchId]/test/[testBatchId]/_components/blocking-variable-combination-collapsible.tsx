import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleChevronIcon, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT, TestT } from "@/src/schemas"
import { TestCard } from "./test-card"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	dependentValues: DependentValueT[]
	blockingVariableCombination: BlockingVariableCombinationT
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
	testsByBlockingVariableCombinations: TestT[][]
	messages: MessageT[]
	evals: EvalT[]
}

export const BlockingVariableCombinationCollapsible = (props: Props) => {
	return (
		<Collapsible className="rounded-none border-b last:border-none">
			<CollapsibleTrigger className="bg-transparent">
				<div className="flex items-center gap-2 font-medium">
					<CollapsibleChevronIcon />
					{props.blockingVariableCombination.map(blockingVariable => (
						<div key={blockingVariable.id}>
							{blockingVariable.name}: {blockingVariable.blockingValue.value}
						</div>
					))}
				</div>

				<Badge size="roundSm" variant="outline">
					{props.testsByBlockingVariableCombinations.length}
				</Badge>
			</CollapsibleTrigger>

			<CollapsibleContent className="space-y-5 p-2 pt-0">
				{props.testsByBlockingVariableCombinations.map(testsByBlockingVariableCombination =>
					testsByBlockingVariableCombination.map(test => (
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
					)),
				)}
			</CollapsibleContent>
		</Collapsible>
	)
}
