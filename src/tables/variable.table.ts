import { capitalize } from "@/utils/capitalize"
import { getOrdinalSuffix } from "@/utils/get-ordinal-suffix"
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

	static varToName(variable: string) {
		return variable.substring(2, variable.length - 2)
	}

	static messageToVarName(input: { role: "system" | "user" | "assistant" } & ({ isCompletion: false; count: number } | { isCompletion: true })) {
		return input.isCompletion ? "Completion" : input.role === "system" ? "System Prompt" : `${getOrdinalSuffix(input.count)} ${capitalize(input.role)} Prompt`
	}

	static messageToVar(input: Parameters<typeof this.messageToVarName>[0]) {
		return this.toVar(this.messageToVarName(input))
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
		let results: Array<{ type: "text"; text: string } | { type: "variable"; name: string; text: string }> = [{ type: "text", text }]

		const replaceResults = (match: string, replacement: string): typeof results => {
			return results.flatMap(result => {
				if (result.type === "variable") {
					return result
				} else {
					return result.text.split(match).flatMap((part, i) =>
						i === 0
							? [{ type: "text", text: part }]
							: [
									{ type: "variable", name: this.varToName(match), text: replacement },
									{ type: "text", text: part },
								],
					)
				}
			})
		}

		// Independent variable
		results = replaceResults(this.toVar(variables.independentVariable.name), variables.independentValue.value)

		// Blocking variables
		for (const blockingVariableCombination of variables.blockingVariableCombination) {
			results = replaceResults(this.toVar(blockingVariableCombination.name), blockingVariableCombination.blockingValue.value)
		}

		// Messages
		variables.messages.forEach((message, i) => {
			const count = variables.messages.slice(0, i + 1).filter(m => m.role === message.role).length
			const variable = !message.isCompletion ? this.messageToVar({ role: message.role, isCompletion: false, count }) : this.messageToVar({ role: message.role, isCompletion: true })
			results = replaceResults(variable, message.content)
		})

		// Filter
		results = results.filter(result => result.text)

		return results
	}
}
