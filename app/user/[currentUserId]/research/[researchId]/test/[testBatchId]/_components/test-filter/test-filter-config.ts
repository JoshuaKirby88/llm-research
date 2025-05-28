import { FiltersState } from "@/components/data-table-filter/core/types"
import { createParser } from "nuqs/server"
import { z } from "zod"

export type TestDefaultFilterProps = {
	params: NextParam<"testBatchId">
}

export const testFilterConfig = {
	searchParamName: "filters",
	join: "and" as const,
	schema: z.custom<FiltersState>(),
	getDefaultFilters: (input: TestDefaultFilterProps): FiltersState => [{ columnId: "testBatchId", type: "number", operator: "is", values: [Number.parseInt(input.params.testBatchId)] }],
	getParser: (input: { params: NextParam<"testBatchId"> }) =>
		createParser({
			parse(value: string) {
				try {
					const json = JSON.parse(value!)
					return testFilterConfig.schema.parse(json)
				} catch {
					return testFilterConfig.getDefaultFilters(input)
				}
			},
			serialize(value: FiltersState) {
				return JSON.stringify(value)
			},
		}).withDefault(testFilterConfig.getDefaultFilters(input)),
}
