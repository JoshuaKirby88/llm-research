import { capitalize } from "@/utils/capitalize"
import { BlockingValueT, BlockingVariableCombinationT, BlockingVariableT, IndependentValueT, IndependentVariableT, MessageT } from "../schemas"

export class VariableTable {
	static createCombination(input: { blockingVariables: BlockingVariableT[]; blockingValues: BlockingValueT[] }) {
		return input.blockingVariables.reduce<BlockingVariableCombinationT[]>(
			(acc, curr) => {
				const blockingValues = input.blockingValues.filter(bVal => bVal.blockingVariableId === curr.id)
				return acc.flatMap(partialCombo => blockingValues.map(blockingValue => [...partialCombo, { ...curr, blockingValue }]))
			},
			[[]],
		)
	}

	static toVar(name: string) {
		return `{{${name}}}`
	}

	static messageToVarName(message: Pick<MessageT, "role" | "isCompletion">) {
		return message.isCompletion ? "Completion" : `${capitalize(message.role)} Prompt`
	}

	static messageToVar(message: Pick<MessageT, "role" | "isCompletion">) {
		return this.toVar(this.messageToVarName(message))
	}

	static replaceVariables(
		text: string,
		variables: {
			independentVariable: IndependentVariableT
			independentValue: IndependentValueT
			blockingVariableCombination: BlockingVariableCombinationT
			messages: Pick<MessageT, "role" | "content" | "isCompletion">[]
		},
	) {
		let replacedText = ""

		// Independent variable
		replacedText = text.replaceAll(this.toVar(variables.independentVariable.name), variables.independentValue.value)
		// Blocking variable
		replacedText = variables.blockingVariableCombination.reduce((acc, curr) => acc.replaceAll(this.toVar(curr.name), curr.blockingValue.value), replacedText)
		// Messages
		replacedText = variables.messages.reduce((acc, curr) => acc.replaceAll(this.messageToVar(curr), curr.content), replacedText)

		return replacedText
	}
}
