import { RunTestI } from "../../schemas"
import { InsertTestBatchModule } from "./modules/insert-test-batch.module"
import { QueryModule } from "./modules/query.module"
import { RunTestModule } from "./modules/run-test.module"

export class RunTestService {
	static async execute(input: RunTestI) {
		const [{ research, independentVariable, independentValues, blockingVariables, blockingValues, dependentValues, messageTemplates, evalPrompt }, apiKey] = await Promise.all([
			QueryModule.queryResearch(input.researchId),
			QueryModule.queryAPIKey(input.userId),
		])

		const testResults = await RunTestModule.execute({
			models: input.models,
			iterations: input.iterations,
			apiKey,
			independentVariable,
			independentValues,
			blockingVariables,
			blockingValues,
			dependentValues,
			messageTemplates,
			evalPrompt,
		})

		return await InsertTestBatchModule.execute({ userId: input.userId, researchId: input.researchId, models: input.models, iterations: input.iterations, research, testResults, dependentValues })
	}
}
