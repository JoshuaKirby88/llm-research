import { BlockingVariableCombinationT, TestT, TestToBlockingValueT } from "../schemas"

export class TestTable {
	static byCombination(tests: TestT[], testToBlockingValues: TestToBlockingValueT[], blockingVariableCombination: BlockingVariableCombinationT) {
		// Group test to blocking values by their parent test
		const groupedTestToBlockingValues = tests.map(test => testToBlockingValues.filter(ttbv => ttbv.testId === test.id))

		// Only keep the blocking combination ids
		const blockingVariableCombinationValueIds = blockingVariableCombination.map(bvc => bvc.blockingValue.id)

		// Get test to blocking values for this blocking variable combination
		const testToBlockingValuesForCombination = groupedTestToBlockingValues.filter(gttbv => gttbv.every(ttbv => blockingVariableCombinationValueIds.includes(ttbv.blockingValueId)))

		// Get tests for this blocking value combination
		const combinationTests = testToBlockingValuesForCombination.map(testToBlockingValue => tests.find(test => test.id === testToBlockingValue[0].testId)!)

		return combinationTests
	}
}
