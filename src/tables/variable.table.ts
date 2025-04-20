import { CoreMessage } from "ai"
import { BlockingVariableCombinationT, BlockingVariableWithValueT, IndependentValueT, IndependentVariableT } from "../schemas"

export class VariableTable {
	static createCombination(blockingVariables: BlockingVariableWithValueT[]) {
		return blockingVariables.reduce(
			(combination, blockingVariable) => combination.flatMap(prefix => blockingVariable.blockingValues.map(blockingValue => [...prefix, { ...blockingVariable, blockingValue }])),
			[[]] as BlockingVariableCombinationT[],
		)
	}

	static toVar(name: string) {
		return `{${name}}`
	}

	static roleToVar(role: CoreMessage["role"]) {
		return this.toVar(`${role}Prompt`)
	}

	static replaceVariables(
		text: string,
		variables: { independentVariable: IndependentVariableT; independentValue: IndependentValueT; blockingVariableCombination: BlockingVariableCombinationT; messages: CoreMessage[] },
	) {
		// Independent variable
		let replacedText = text.replaceAll(this.toVar(variables.independentVariable.name), variables.independentValue.value)
		// Blocking variable
		replacedText = variables.blockingVariableCombination.reduce((acc, curr) => acc.replaceAll(`{${curr.name}}`, curr.blockingValue.value), replacedText)
		// Messages
		return variables.messages.reduce((acc, curr) => acc.replaceAll(this.roleToVar(curr.role), curr.content as string), replacedText)
	}
}
