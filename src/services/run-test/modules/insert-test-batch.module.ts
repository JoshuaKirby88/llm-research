import { transaction } from "@/drizzle/transaction"
import { AIFeature } from "@/src/features"
import { ContributorRepo, EvalRepo, MessageRepo, TestBatchRepo, TestBatchResultRepo, TestModelBatchRepo, TestModelBatchResultRepo, TestRepo, TestToBlockingValueRepo } from "@/src/repos"
import {
	DependentValueT,
	InsertEvalT,
	InsertTestBatchResultT,
	InsertTestModelBatchResultT,
	InsertTestModelBatchT,
	InsertTestT,
	InsertTestToBlockingValueT,
	RawInsertMessageT,
	ResearchT,
	RunTestI,
} from "@/src/schemas"
import { RunTestModule } from "./run-test.module"

type Input = RunTestI & {
	research: ResearchT
	testResults: Return<typeof RunTestModule.execute>
	dependentValues: DependentValueT[]
}

export class InsertTestBatchModule {
	static async execute(input: Input) {
		const totalTestsCount = input.testResults.flat().length

		const contributor = await ContributorRepo.incrementCount({ count: totalTestsCount, isOwner: input.research.userId === input.userId, userId: input.userId, researchId: input.researchId })

		return await transaction(async () => {
			const newTestBatch = await TestBatchRepo.insert({
				researchId: input.researchId,
				contributorId: contributor.id,
				testCount: totalTestsCount,
				model: AIFeature.promptModel,
				iterations: input.iterations,
			})

			return await transaction(async () => {
				const testModelBatchesToInsert: InsertTestModelBatchT[] = input.models.map(model => ({
					testCount: input.testResults.filter(testResult => testResult.model === model).length,
					model,
					testBatchId: newTestBatch.id,
				}))
				const newTestModelBatches = await TestModelBatchRepo.insertMany(testModelBatchesToInsert)

				const testsToInsert: InsertTestT[] = newTestModelBatches.flatMap(newTestModelBatch =>
					input.testResults
						.filter(testResult => testResult.model === newTestModelBatch.model)
						.map(testResult => ({
							independentValueId: testResult.independentValue.id,
							dependentValueId: testResult.dependentValue.id,
							testModelBatchId: newTestModelBatch.id,
						})),
				)
				const newTests = await TestRepo.insertMany(testsToInsert)

				const testToBlockingValuesToInsert: InsertTestToBlockingValueT[] = newTests.flatMap((newTest, i) =>
					input.testResults[i].blockingValues.map(blockingValue => ({
						testId: newTest.id,
						blockingValueId: blockingValue.id,
					})),
				)
				const newTestToBlockingValues = await TestToBlockingValueRepo.insertMany(testToBlockingValuesToInsert)

				const messagesToInsert: RawInsertMessageT[] = newTests.flatMap((newTest, i) =>
					input.testResults[i].messages.map(message => ({
						...message,
						testId: newTest.id,
					})),
				)
				const newMessages = await MessageRepo.insertMany(messagesToInsert)

				const evalsToInsert: InsertEvalT[] = newTests.map((newTest, i) => ({
					content: input.testResults[i].evaluation.content,
					promptTokens: input.testResults[i].evaluation.promptTokens,
					completionTokens: input.testResults[i].evaluation.completionTokens,
					evalPromptId: input.testResults[i].evaluation.evalPromptId,
					testId: newTest.id,
				}))
				const newEvals = await EvalRepo.insertMany(evalsToInsert)

				const testModelBatchResultsToInsert: InsertTestModelBatchResultT[] = newTestModelBatches.flatMap((newTestModelBatch, i) =>
					input.dependentValues.map(dependentValue => ({
						count: input.testResults.filter(testResult => testResult.model === newTestModelBatch.model && testResult.dependentValue.id === dependentValue.id).length,
						testModelBatchId: newTestModelBatch.id,
						dependentValueId: dependentValue.id,
					})),
				)
				const newTestModelBatchResults = await TestModelBatchResultRepo.insertMany(testModelBatchResultsToInsert)

				const testBatchResultsToInsert: InsertTestBatchResultT[] = input.dependentValues.map(dependentValue => ({
					count: input.testResults.filter(testResult => testResult.dependentValue.id === dependentValue.id).length,
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
					newTestModelBatchResults,
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
