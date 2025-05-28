import { dataTableFilterToDrizzle, joinDrizzleFilters } from "@/components/data-table-filter/utils/data-table-filter-to-drizzle"
import { Test, TestBatch } from "@/drizzle/schema"
import { TestFilter } from "./test-filter-columns"
import { testFilterConfig } from "./test-filter-config"

export const testFilterToDrizzle = (input: { params: NextParam<"testBatchId">; searchParams: NextSearchParam }) => {
	const filters = testFilterConfig.getParser({ params: input.params }).parse(input.searchParams[testFilterConfig.searchParamName]!) as TestFilter[] | null

	const testBatchFilters = filters?.map(filter => {
		if (filter.columnId === "testBatchId") {
			return dataTableFilterToDrizzle({ table: TestBatch, filters: [{ ...filter, columnId: "id" }] })
		} else if (filter.columnId === "testBatchCreatedAt") {
			return dataTableFilterToDrizzle({ table: TestBatch, filters: [{ ...filter, columnId: "createdAt" }] })
		} else if (filter.columnId === "contributorIds") {
			return dataTableFilterToDrizzle({ table: TestBatch, filters: [{ ...filter, columnId: "contributorId" }] })
		}
	})

	const testFilters = filters?.flatMap(filter => {
		if (filter.columnId === "independentValueId") {
			return dataTableFilterToDrizzle({ table: Test, filters: [{ ...filter, columnId: "independentValueId" }] })
		} else if (filter.columnId === "blockingValueId") {
			// return dataTableFilterToDrizzle({ table: Test, filters: [{ ...filter, columnId: "createdAt" }] })
		} else if (filter.columnId === "dependentValueId") {
			return dataTableFilterToDrizzle({ table: Test, filters: [{ ...filter, columnId: "dependentValueId" }] })
		} else if (filter.columnId === "testId") {
			return dataTableFilterToDrizzle({ table: Test, filters: [{ ...filter, columnId: "id" }] })
		}
	})

	return {
		testBatchFilters: joinDrizzleFilters({ filters: testBatchFilters, joinOperator: testFilterConfig.join }),
		testFilters: joinDrizzleFilters({ filters: testFilters, joinOperator: testFilterConfig.join }),
	}
}
