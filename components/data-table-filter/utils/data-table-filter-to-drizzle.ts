import { endOfDay, startOfDay } from "date-fns"
import { type AnyColumn, type SQL, type Table, and, arrayContains, arrayOverlaps, between, eq, gt, gte, ilike, inArray, lt, lte, ne, not, notBetween, notIlike, notInArray, or } from "drizzle-orm"
import { ColumnDataType, FilterModel, FilterModelUnion } from "../core/types"

type Filter<T extends Table> = Omit<FilterModel<ColumnDataType>, "columnId"> & { columnId: keyof T["_"]["columns"] }

export function dataTableFilterToDrizzle<T extends Table>(input: { table: T; filters: Filter<T>[]; joinOperator?: "and" | "or" }): SQL | undefined {
	const filters = input.filters as FilterModelUnion[]

	const conditions = filters.map(filter => {
		const column = input.table[filter.columnId as keyof T] as AnyColumn

		switch (filter.type) {
			case "text":
				switch (filter.operator) {
					case "contains":
						return ilike(column, filter.values[0])
					case "does not contain":
						return notIlike(column, filter.values[0])
				}
			case "number":
				switch (filter.operator) {
					case "is":
						return eq(column, filter.values[0])
					case "is between":
						return between(column, filter.values[0], filter.values[1])
					case "is greater than":
						return gt(column, filter.values[0])
					case "is greater than or equal to":
						return gte(column, filter.values[0])
					case "is less than":
						lt(column, filter.values[0])
					case "is less than or equal to":
						return lte(column, filter.values[0])
					case "is not":
						return ne(column, filter.values[0])
					case "is not between":
						return notBetween(column, filter.values[0], filter.values[1])
				}
			case "date":
				const date = new Date(filter.values[0])
				const secondDate = new Date(filter.values[1])

				switch (filter.operator) {
					case "is":
						return between(column, startOfDay(date), endOfDay(date))
					case "is after":
						return gt(column, endOfDay(date))
					case "is before":
						return lt(column, startOfDay(date))
					case "is between":
						return between(column, startOfDay(date), endOfDay(secondDate))
					case "is not":
						return notBetween(column, startOfDay(date), endOfDay(date))
					case "is not between":
						return notBetween(column, startOfDay(date), endOfDay(secondDate))
					case "is on or after":
						return gte(column, startOfDay(date))
					case "is on or before":
						return lte(column, endOfDay(date))
				}
			case "option":
				switch (filter.operator) {
					case "is":
						return eq(column, filter.values[0])
					case "is not":
						return ne(column, filter.values[0])
					case "is any of":
						return inArray(column, filter.values)
					case "is none of":
						return notInArray(column, filter.values)
				}
			case "multiOption":
				switch (filter.operator) {
					case "exclude":
						return not(arrayContains(column, filter.values))
					case "exclude if all":
						return not(arrayContains(column, filter.values))
					case "exclude if any of":
						return not(arrayOverlaps(column, filter.values))
					case "include":
						return arrayContains(column, filter.values)
					case "include all of":
						return arrayContains(column, filter.values)
					case "include any of":
						return arrayOverlaps(column, filter.values)
				}
		}
	})

	return joinDrizzleFilters({ filters: conditions, joinOperator: input.joinOperator })
}

export const joinDrizzleFilters = (input: { filters: Array<SQL | undefined> | undefined; joinOperator: "and" | "or" | undefined }) => {
	const joinFn = input.joinOperator === "and" ? and : or
	const validFilters = input.filters?.filter(Boolean)
	return validFilters?.length === 1 ? validFilters[0] : validFilters?.length ? joinFn(...validFilters) : undefined
}
