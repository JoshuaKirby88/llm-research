import { BlockingVariableCombinationT, TestT, TestToBlockingValueT } from "../schemas"

export class TestTable {
	static byCombination(tests: TestT[], testToBlockingValues: TestToBlockingValueT[], blockingVariableCombination: BlockingVariableCombinationT) {
		// Group test to blocking values by their parent test
		const groupedTestToBlockingValues = tests.map(test => testToBlockingValues.filter(ttbv => ttbv.testId === test.id))

		// Only keep the blocking combination ids
		const blockingValueCombinationIds = blockingVariableCombination.map(bvc => bvc.blockingValue.id)
		// Find the testToBlockingValues for the current combination
		const groupedTestToBlockingValue = groupedTestToBlockingValues.find(gttbv => gttbv.every(ttbv => blockingValueCombinationIds.includes(ttbv.blockingValueId)))!
		// Only keep the test id
		const groupedTestToBlockingValueTestId = groupedTestToBlockingValue[0].testId
		// Get tests for this blocking value combination
		const combinationTests = tests.filter(test => groupedTestToBlockingValueTestId === test.id)

		return combinationTests
	}
}
