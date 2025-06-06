import { useIsMobile } from "@/hooks/use-is-mobile"
import type { Column, DataTableFilterActions, FilterStrategy, FiltersState } from "../core/types"
import type { Locale } from "../lib/i18n"
import { ActiveFilters, ActiveFiltersMobileContainer } from "./active-filters"
import { FilterActions } from "./filter-actions"
import { FilterSelector } from "./filter-selector"

interface DataTableFilterProps<TData> {
	columns: Column<TData>[]
	filters: FiltersState
	actions: DataTableFilterActions
	strategy: FilterStrategy
	locale?: Locale
}

export function DataTableFilter<TData>({ columns, filters, actions, strategy, locale = "en" }: DataTableFilterProps<TData>) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return (
			<div className="flex w-full justify-between gap-2">
				<div className="flex items-center gap-1">
					<FilterSelector columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
					<FilterActions hasFilters={filters.length > 0} actions={actions} locale={locale} />
				</div>

				<ActiveFiltersMobileContainer>
					<ActiveFilters columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
				</ActiveFiltersMobileContainer>
			</div>
		)
	}

	return (
		<div className="flex w-full justify-between gap-2">
			<div className="flex w-full flex-1 items-center gap-2 md:flex-wrap">
				<FilterSelector columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
				<ActiveFilters columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
			</div>

			<FilterActions hasFilters={filters.length > 0} actions={actions} locale={locale} />
		</div>
	)
}
