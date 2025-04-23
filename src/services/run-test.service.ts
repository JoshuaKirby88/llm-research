import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { transaction } from "@/drizzle/transaction"
import { APIKeyRepo, ContributorRepo, MessageRepo, TestBatchRepo, TestBatchResultRepo, TestModelBatchRepo, TestModelBatchResultRepo, TestRepo, TestToBlockingValueRepo } from "@/src/repos"
import {
	BlockingValueT,
	BlockingVariableCombinationT,
	DependentValueT,
	EvalPromptT,
	IndependentValueT,
	IndependentVariableWithValueT,
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
import { CoreMessage } from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { AIFeature, AIModel } from "../features"
import { EvalRepo } from "../repos/eval.repo"
import { RunTest } from "../schemas/features/run-test.schema"
import { APIKeyTable, VariableTable } from "../tables"
import { AIServiceInstance } from "./ai.service"

type Research = NonNullable<Awaited<ReturnType<(typeof RunTestService)["queryResearch"]>>>

type TestRunInput = {
	model: AIModel
	messagePrompts: MessagePromptT[]
	independentVariable: IndependentVariableWithValueT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	evalPrompt: EvalPromptT
	dependentValues: DependentValueT[]
}

type EvaluateInput = {
	independentVariable: IndependentVariableWithValueT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	messages: CoreMessage[]
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
	static async execute(input: RunTest) {
		const [research, apiKey] = await Promise.all([this.queryResearch(input.researchId), this.queryAPIKey(input.userId)])

		if (!research?.independentVariable || !research.evalPrompt) {
			throw new Error("No research")
		}

		const AIService = new AIServiceInstance(apiKey)

		const blockingVariableCombinations = VariableTable.createCombination(research.blockingVariables)

		const testModelBatchResultPromises: Promise<TestResult[]>[] = []

		for (const model of input.models) {
			const testResultPromises: Promise<TestResult>[] = []

			for (const independentValue of research.independentVariable.independentValues) {
				for (const blockingVariableCombination of blockingVariableCombinations) {
					for (let i = 0; i < input.iterations; i++) {
						const testResultPromise = this.runTest(
							{
								model,
								independentVariable: research.independentVariable,
								independentValue,
								blockingVariableCombination,
								dependentValues: research.dependentValues,
								messagePrompts: research.messagePrompts,
								evalPrompt: research.evalPrompt,
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
			testModelBatchResults,
		}
	}

	private static async queryResearch(researchId: ResearchT["id"]) {
		const research = await db.query.Research.findFirst({
			where: eq(Research.id, researchId),
			with: {
				independentVariable: {
					with: {
						independentValues: true,
					},
				},
				blockingVariables: {
					with: {
						blockingValues: true,
					},
				},
				messagePrompts: true,
				evalPrompt: true,
				dependentValues: true,
			},
		})

		return research
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
			const result = await AIService.getCompletion({
				model: AIFeature.promptModel,
				messages: [{ role: "user", content: VariableTable.replaceVariables(messagePrompt.text, { ...input, messages: generatedMessage }) }],
			})

			generatedMessage.push({ role: messagePrompt.role, content: result.completion, isCompletion: false, messagePromptId: messagePrompt.id, ...result.tokens })
		}

		return generatedMessage
	}

	private static async evaluate(input: EvaluateInput, AIService: AIServiceInstance) {
		const evalResult = await AIService.getStructuredCompletion({
			model: AIFeature.promptModel,
			messages: [{ role: "user", content: VariableTable.replaceVariables(input.evalPrompt.text, input) }],
			schema: z.object({ evaluation: z.enum(input.dependentValues.map(dp => dp.value) as [string, ...string[]]) }),
		})

		const dependentValue = input.dependentValues.find(dv => dv.value === evalResult.completion.evaluation)

		return {
			evalResult,
			dependentValue: dependentValue!,
		}
	}

	static async insertTestBatch(input: RunTest, research: Research, testModelBatchResults: TestResult[][]) {
		return await transaction(async tx => {
			const totalTestsCount = testModelBatchResults.flat().length

			const contributor = await ContributorRepo.incrementCount({ userId: input.userId, researchId: input.researchId, count: totalTestsCount }, tx)

			const newTestBatch = await TestBatchRepo.insert(
				{ researchId: input.researchId, contributorId: contributor.id, testCount: totalTestsCount, model: AIFeature.promptModel, iterations: input.iterations },
				tx,
			)

			const testModelBatchesToInsert: InsertTestModelBatchT[] = testModelBatchResults.map(testModelBatchResult => ({
				testCount: testModelBatchResult.length,
				model: testModelBatchResult[0].model,
				testBatchId: newTestBatch.id,
			}))
			const newTestModelBatches = await TestModelBatchRepo.insertMany(testModelBatchesToInsert, tx)

			const testsToInsert: InsertTestT[] = testModelBatchResults.flatMap((testModelBatchResult, i) =>
				testModelBatchResult.map(test => ({
					testModelBatchId: newTestModelBatches[i].id,
					independentValueId: test.independentValue.id,
					dependentValueId: test.dependentValue.id,
				})),
			)
			const newTests = await TestRepo.insertMany(testsToInsert, tx)

			const testToBlockingValuesToInsert: InsertTestToBlockingValueT[] = testModelBatchResults.flatMap(testModelBatchResult =>
				testModelBatchResult.flatMap((test, i) =>
					test.blockingValues.map(blockingValue => ({
						testId: newTests[i].id,
						blockingValueId: blockingValue.id,
					})),
				),
			)
			const newTestToBlockingValues = await TestToBlockingValueRepo.insertMany(testToBlockingValuesToInsert, tx)

			const messagesToInsert: InsertMessageT[] = testModelBatchResults.flatMap(testModelBatchResult =>
				testModelBatchResult.flatMap((testResult, i) =>
					testResult.messages.map(message => ({
						testId: newTests[i].id,
						...message,
					})),
				),
			)
			const newMessages = await MessageRepo.insertMany(messagesToInsert, tx)

			const evalsToInsert: InsertEvalT[] = testModelBatchResults.flatMap(testModelBatchResult =>
				testModelBatchResult.flatMap((testResult, i) => ({
					testId: newTests[i].id,
					...testResult.evaluation,
				})),
			)
			const newEvals = await EvalRepo.insertMany(evalsToInsert, tx)

			const testModelBatchResultToInsert: InsertTestModelBatchResultT[] = testModelBatchResults.flatMap((testModelBatchResult, i) =>
				research.dependentValues.map(dependentValue => ({
					testModelBatchId: newTestModelBatches[i].id,
					dependentValueId: dependentValue.id,
					count: testModelBatchResult.filter(test => test.dependentValue.id === dependentValue.id).length,
				})),
			)
			await TestModelBatchResultRepo.insertMany(testModelBatchResultToInsert, tx)

			const testBatchResultsToInsert: InsertTestBatchResultT[] = research.dependentValues.map(dependentValue => ({
				dependentValueId: dependentValue.id,
				testBatchId: newTestBatch.id,
				count: testModelBatchResults.flatMap(testModelBatchResult => testModelBatchResult.filter(test => test.dependentValue.id === dependentValue.id)).length,
			}))
			const newTestBatchResults = await TestBatchResultRepo.insertMany(testBatchResultsToInsert, tx)

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
		})
	}
}
