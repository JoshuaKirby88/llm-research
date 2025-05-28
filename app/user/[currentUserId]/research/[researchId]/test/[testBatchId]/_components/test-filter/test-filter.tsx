"use client"

import { DataTableFilter } from "@/components/data-table-filter"
import { useDataTableFilters } from "@/components/data-table-filter"
import { FiltersState } from "@/components/data-table-filter/core/types"
import { useQueryState } from "nuqs"
import { TestFilterColumnsConfigProps, TestFilterRow, testFilterColumnsConfig } from "./test-filter-columns"
import { TestDefaultFilterProps, testFilterConfig } from "./test-filter-config"

export const TestFilter = ({ params, ...props }: TestFilterColumnsConfigProps & TestDefaultFilterProps) => {
	const [filters, setFilters] = useQueryState<FiltersState>(testFilterConfig.searchParamName, { shallow: false, ...testFilterConfig.getParser({ params }) })

	const { columns, actions, strategy } = useDataTableFilters({
		strategy: "server",
		data: [] as TestFilterRow[],
		columnsConfig: testFilterColumnsConfig(props),
		filters,
		onFiltersChange: setFilters,
	})

	return <DataTableFilter filters={filters} columns={columns} actions={actions} strategy={strategy} />
}
