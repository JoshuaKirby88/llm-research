import { AIFeature } from "@/src/features"
import {
	APIKeyT,
	BlockingValueT,
	BlockingVariableT,
	DependentValueT,
	EvalPromptT,
	IndependentValueT,
	IndependentVariableT,
	InsertMessageT,
	MessageTemplateT,
	RunTestI,
	aiServiceSchemas,
} from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { AIServiceI } from "../../ai.service"

type Input = Pick<RunTestI, "models" | "iterations"> & {
	apiKey: APIKeyT
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingVariables: BlockingVariableT[]
	blockingValues: BlockingValueT[]
	dependentValues: DependentValueT[]
	messageTemplates: MessageTemplateT[]
	evalPrompt: EvalPromptT
}

export class RunTestModule {
	static async execute(input: Input) {
		const UserAIService = new AIServiceI(input.apiKey)

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
		for (const messageTemplate of input.messageTemplates) {
			if (messageTemplate.isPrompt) {
				const generateMessageResults = await UserAIService.batchStructuredCompletion(
					tests.map(test => ({
						model: AIFeature.promptModel,
						messages: [
							{
								role: "user",
								content: VariableTable.replaceVariables(messageTemplate.text, {
									independentVariable: input.independentVariable,
									independentValue: test.independentValue,
									blockingVariableCombination: test.blockingVariableCombination,
									messages: test.messages,
								}).reduce((acc, curr) => acc + curr.text, ""),
							},
						],
						schema: aiServiceSchemas.generateMessage().json,
					})),
				)

				generateMessageResults.forEach((messageResult, i) =>
					tests[i].messages.push({
						type: "generated",
						role: messageTemplate.role,
						content: messageResult.completion.answer,
						promptTokens: messageResult.tokens.promptTokens,
						completionTokens: messageResult.tokens.completionTokens,
						messageTemplateId: messageTemplate.id,
					}),
				)
			} else {
				tests.forEach(test =>
					test.messages.push({
						type: "raw",
						role: messageTemplate.role,
						content: VariableTable.replaceVariables(messageTemplate.text, {
							independentVariable: input.independentVariable,
							independentValue: test.independentValue,
							blockingVariableCombination: test.blockingVariableCombination,
							messages: test.messages,
						}).reduce((acc, curr) => acc + curr.text, ""),
						messageTemplateId: messageTemplate.id,
					}),
				)
			}
		}

		// Run test
		const runTestResults = await UserAIService.batchCompletion(
			tests.map(test => ({
				model: test.model,
				messages: test.messages,
			})),
		)

		runTestResults.forEach((testResult, i) =>
			tests[i].messages.push({
				type: "completion",
				role: "assistant",
				content: testResult.completion,
				promptTokens: testResult.tokens.promptTokens,
				completionTokens: testResult.tokens.completionTokens,
			}),
		)

		// Evaluate
		const evalResults = await UserAIService.batchStructuredCompletion(
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
						}).reduce((acc, curr) => acc + curr.text, ""),
					},
				],
				schema: aiServiceSchemas.evaluate(input.dependentValues.map(dVal => dVal.value)).json,
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
