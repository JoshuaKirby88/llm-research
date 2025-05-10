import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { transaction } from "@/drizzle/transaction"
import { APIKeyRepo, ContributorRepo, EvalRepo, MessageRepo, TestBatchRepo, TestBatchResultRepo, TestModelBatchRepo, TestModelBatchResultRepo, TestRepo, TestToBlockingValueRepo } from "@/src/repos"
import {
	BlockingValueT,
	BlockingVariableCombinationT,
	DependentValueT,
	EvalPromptT,
	IndependentValueT,
	IndependentVariableT,
	InsertCompletionMessageT,
	InsertEvalT,
	InsertGeneratedMessageT,
	InsertMessageT,
	InsertTestBatchResultT,
	InsertTestModelBatchResultT,
	InsertTestModelBatchT,
	InsertTestT,
	InsertTestToBlockingValueT,
	MessagePromptT,
	ResearchT,
} from "@/src/schemas"
import { destructureArray } from "@/utils/destructure-array"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { AIFeature, AIModel } from "../features"
import { RunTestI } from "../schemas/features/run-test.schema"
import { APIKeyTable, VariableTable } from "../tables"
import { AIServiceInstance } from "./ai.service"

type Research = NonNullable<Awaited<ReturnType<(typeof RunTestService)["queryResearch"]>>>

type TestRunInput = {
	model: AIModel
	messagePrompts: MessagePromptT[]
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	evalPrompt: EvalPromptT
	dependentValues: DependentValueT[]
}

type EvaluateInput = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	messages: Omit<InsertMessageT, "testId">[]
	completion: string
	evalPrompt: EvalPromptT
	dependentValues: DependentValueT[]
}

type TestResult = {
	model: AIModel
	independentValue: IndependentValueT
	blockingValues: BlockingValueT[]
	dependentValue: DependentValueT
	messages: Omit<InsertMessageT, "testId">[]
	evaluation: Omit<InsertEvalT, "testId">
}

export class RunTestService {
	static async execute(input: RunTestI) {
		const [{ research, independentVariable, independentValues, blockingVariables, blockingValues, dependentValues, messagePrompts, evalPrompt }, apiKey] = await Promise.all([
			this.queryResearch(input.researchId),
			this.queryAPIKey(input.userId),
		])

		const AIService = new AIServiceInstance(apiKey)

		const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables, blockingValues })

		const testModelBatchResultPromises: Promise<TestResult[]>[] = []

		for (const model of input.models) {
			const testResultPromises: Promise<TestResult>[] = []

			for (const independentValue of independentValues) {
				for (const blockingVariableCombination of blockingVariableCombinations) {
					for (let i = 0; i < input.iterations; i++) {
						const testResultPromise = this.runTest(
							{
								model,
								independentVariable,
								independentValue,
								blockingVariableCombination,
								dependentValues,
								messagePrompts,
								evalPrompt,
							},
							AIService,
						)

						testResultPromises.push(testResultPromise)
					}
				}
			}

			testModelBatchResultPromises.push(Promise.all(testResultPromises))
		}

		const testModelBatchResults = await Promise.all(testModelBatchResultPromises)

		return {
			research,
			dependentValues,
			testModelBatchResults,
		}
	}

	private static async queryResearch(researchId: ResearchT["id"]) {
		const result = await db.query.Research.findFirst({
			where: eq(Research.id, researchId),
			with: {
				independentVariable: {
					with: { independentValues: true },
				},
				blockingVariables: {
					with: { blockingValues: true },
				},
				dependentValues: true,
				messagePrompts: true,
				evalPrompt: true,
			},
		})

		if (!result) {
			throw new Error("No research")
		}

		const [
			[research],
			{
				independentVariable: [independentVariable],
				evalPrompt: [evalPrompt],
				...rest
			},
		] = destructureArray([result], {
			independentVariable: { independentValues: true },
			blockingVariables: { blockingValues: true },
			dependentValues: true,
			messagePrompts: true,
			evalPrompt: true,
		})

		return { research, independentVariable, evalPrompt, ...rest }
	}

	private static async queryAPIKey(userId: string) {
		const apiKey = await APIKeyRepo.query(userId)
		return APIKeyTable.validate(apiKey)
	}

	private static async runTest(input: TestRunInput, AIService: AIServiceInstance) {
		const messages: Omit<InsertMessageT, "testId">[] = []

		const generatedMessages = await this.generateMessages(input, AIService)
		messages.push(...generatedMessages)

		const result = await AIService.getCompletion({ ...input, messages })
		const completionMessage: Omit<InsertCompletionMessageT, "testId"> = { role: "assistant", content: result.completion, isCompletion: true, ...result.tokens }
		messages.push(completionMessage)

		const { evalResult, dependentValue } = await this.evaluate({ ...input, messages, completion: result.completion }, AIService)
		const evaluation: Omit<InsertEvalT, "testId"> = { content: evalResult.completion.evaluation, evalPromptId: input.evalPrompt.id, ...evalResult.tokens }

		return {
			model: input.model,
			independentValue: input.independentValue,
			blockingValues: input.blockingVariableCombination.map(bvc => bvc.blockingValue),
			dependentValue,
			messages,
			evaluation,
		} satisfies TestResult
	}

	private static async generateMessages(input: TestRunInput, AIService: AIServiceInstance) {
		const generatedMessage: Omit<InsertGeneratedMessageT, "testId">[] = []

		for (const messagePrompt of input.messagePrompts) {
			const result = await AIService.getStructuredCompletion({
				model: AIFeature.promptModel,
				messages: [{ role: "user", content: VariableTable.replaceVariables(messagePrompt.text, { ...input, messages: generatedMessage }) }],
				schema: z.object({ answer: z.string().describe("Just the generated text.") }),
			})

			generatedMessage.push({ role: messagePrompt.role, content: result.completion.answer, isCompletion: false, messagePromptId: messagePrompt.id, ...result.tokens })
		}

		return generatedMessage
	}

	private static async evaluate(input: EvaluateInput, AIService: AIServiceInstance) {
		const evalResult = await AIService.getStructuredCompletion({
			model: AIFeature.promptModel,
			messages: [{ role: "user", content: VariableTable.replaceVariables(input.evalPrompt.text, input) }],
			schema: z.object({ evaluation: z.enum(input.dependentValues.map(dp => dp.value) as [string, ...string[]]) }),
		})

		const dependentValue = input.dependentValues.find(dVal => dVal.value === evalResult.completion.evaluation)

		return {
			evalResult,
			dependentValue: dependentValue!,
		}
	}

	static async insertTestBatch(input: RunTestI, research: ResearchT, dependentValues: DependentValueT[], testModelBatchResults: TestResult[][]) {
		const totalTestsCount = testModelBatchResults.flat().length

		const contributor = await ContributorRepo.incrementCount({ userId: input.userId, researchId: input.researchId, count: totalTestsCount })

		return await transaction(async () => {
			const newTestBatch = await TestBatchRepo.insert({
				researchId: input.researchId,
				contributorId: contributor.id,
				testCount: totalTestsCount,
				model: AIFeature.promptModel,
				iterations: input.iterations,
			})

			return await transaction(async () => {
				const testModelBatchesToInsert: InsertTestModelBatchT[] = testModelBatchResults.map(testResults => ({
					testCount: testResults.length,
					model: testResults[0].model,
					testBatchId: newTestBatch.id,
				}))
				const newTestModelBatches = await TestModelBatchRepo.insertMany(testModelBatchesToInsert)

				const testsToInsert: InsertTestT[] = testModelBatchResults.flatMap((testResults, i) =>
					testResults.map(testResult => ({
						testModelBatchId: newTestModelBatches[i].id,
						independentValueId: testResult.independentValue.id,
						dependentValueId: testResult.dependentValue.id,
					})),
				)
				const newTests = await TestRepo.insertMany(testsToInsert)

				const testToBlockingValuesToInsert: InsertTestToBlockingValueT[] = testModelBatchResults.flatMap((testResults, i) =>
					testResults.flatMap((testResult, j) =>
						testResult.blockingValues.map(blockingValue => ({
							testId: newTests[i * testResults.length + j].id,
							blockingValueId: blockingValue.id,
						})),
					),
				)
				const newTestToBlockingValues = await TestToBlockingValueRepo.insertMany(testToBlockingValuesToInsert)

				const messagesToInsert: InsertMessageT[] = testModelBatchResults.flatMap((testResults, i) =>
					testResults.flatMap((testResult, j) =>
						testResult.messages.map(message => ({
							testId: newTests[i * testResults.length + j].id,
							...message,
						})),
					),
				)
				const newMessages = await MessageRepo.insertMany(messagesToInsert)

				const evalsToInsert: InsertEvalT[] = testModelBatchResults.flatMap((testResults, i) =>
					testResults.flatMap((testResult, j) => ({
						testId: newTests[i * testResults.length + j].id,
						...testResult.evaluation,
					})),
				)
				const newEvals = await EvalRepo.insertMany(evalsToInsert)

				const testModelBatchResultsToInsert: InsertTestModelBatchResultT[] = testModelBatchResults.flatMap((testResults, i) =>
					dependentValues.map(dependentValue => ({
						count: testResults.filter(testResult => testResult.dependentValue.id === dependentValue.id).length,
						testModelBatchId: newTestModelBatches[i].id,
						dependentValueId: dependentValue.id,
					})),
				)
				await TestModelBatchResultRepo.insertMany(testModelBatchResultsToInsert)

				const testBatchResultsToInsert: InsertTestBatchResultT[] = dependentValues.map(dependentValue => ({
					count: testModelBatchResults.flatMap(testResults => testResults.filter(testResult => testResult.dependentValue.id === dependentValue.id)).length,
					dependentValueId: dependentValue.id,
					testBatchId: newTestBatch.id,
				}))
				const newTestBatchResults = await TestBatchResultRepo.insertMany(testBatchResultsToInsert)

				return {
					contributor,
					newTestBatch,
					newTestModelBatches,
					newTests,
					newTestToBlockingValues,
					newMessages,
					newEvals,
					newTestBatchResults,
				}
			}).onError(async () => {
				await TestBatchRepo.delete(newTestBatch.id)
			})
		}).onError(async () => {
			await ContributorRepo.undoIncrementCount({ count: totalTestsCount }, contributor)
		})
	}
}
