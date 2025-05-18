import { AIFeature } from "@/src/features"
import { APIKeyT, BlockingValueT, BlockingVariableT, DependentValueT, EvalPromptT, IndependentValueT, IndependentVariableT, InsertMessageT, MessagePromptT, RunTestI } from "@/src/schemas"
import { AIServiceSchemas } from "@/src/schemas/services/ai-service.schema"
import { VariableTable } from "@/src/tables"
import { AIServiceInstance } from "../../ai.service"

type Input = Pick<RunTestI, "models" | "iterations"> & {
	apiKey: APIKeyT
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariables: BlockingVariableT[]
	blockingValues: BlockingValueT[]
	dependentValues: DependentValueT[]
	messagePrompts: MessagePromptT[]
	evalPrompt: EvalPromptT
}

export class RunTestModule {
	static async execute(input: Input) {
		const AIService = new AIServiceInstance(input.apiKey)

		const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables: input.blockingVariables, blockingValues: input.blockingValues })

		const tests = input.models.flatMap(model =>
			input.independentValues.flatMap(independentValue =>
				blockingVariableCombinations.flatMap(blockingVariableCombination =>
					Array.from({ length: input.iterations }, () => ({
						model,
						independentValue,
						blockingVariableCombination,
						messages: [] as Omit<InsertMessageT, "testId">[],
					})),
				),
			),
		)

		// Generate messages
		for (const messagePrompt of input.messagePrompts) {
			const generateMessageResults = await AIService.batchStructuredCompletion(
				tests.map(test => ({
					model: AIFeature.promptModel,
					messages: [
						{
							role: "user",
							content: VariableTable.replaceVariables(messagePrompt.text, {
								independentVariable: input.independentVariable,
								independentValue: test.independentValue,
								blockingVariableCombination: test.blockingVariableCombination,
								messages: test.messages,
							}),
						},
					],
					schema: AIServiceSchemas.generateMessage().json,
				})),
			)

			generateMessageResults.forEach((messageResult, i) =>
				tests[i].messages.push({ role: messagePrompt.role, content: messageResult.completion.answer, isCompletion: false, messagePromptId: messagePrompt.id, ...messageResult.tokens }),
			)
		}

		// Run test
		const runTestResults = await AIService.batchCompletion(
			tests.map(test => ({
				model: test.model,
				messages: test.messages,
			})),
		)

		runTestResults.forEach((testResult, i) => tests[i].messages.push({ role: "assistant", content: testResult.completion, isCompletion: true, ...testResult.tokens }))

		// Evaluate
		const evalResults = await AIService.batchStructuredCompletion(
			tests.map(test => ({
				model: AIFeature.promptModel,
				messages: [
					{
						role: "user",
						content: VariableTable.replaceVariables(input.evalPrompt.text, {
							independentVariable: input.independentVariable,
							independentValue: test.independentValue,
							blockingVariableCombination: test.blockingVariableCombination,
							messages: test.messages,
						}),
					},
				],
				schema: AIServiceSchemas.evaluate(input.dependentValues.map(dVal => dVal.value)).json,
			})),
		)

		const results = tests.map((test, i) => ({
			...test,
			blockingValues: test.blockingVariableCombination.map(bvc => bvc.blockingValue),
			dependentValue: input.dependentValues.find(dVal => dVal.value === evalResults[i].completion.evaluation)!,
			evaluation: { content: evalResults[i].completion.evaluation, evalPromptId: input.evalPrompt.id, ...evalResults[i].tokens },
		}))

		return results
	}
}
