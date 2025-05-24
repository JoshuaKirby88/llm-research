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
									{ type: "variable", name: match.substring(2, match.length - 2), text: replacement },
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
		for (const message of variables.messages) {
			results = replaceResults(this.messageToVar(message), message.content)
		}

		return results
	}
}
