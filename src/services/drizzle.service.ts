import { AnyColumn, SQL, Table, and, eq, sql } from "drizzle-orm"

type TypeSafeTable<T extends Table> = T & Record<TableKey<T>, T["_"]["columns"][TableKey<T>]>
export type TableWhere<T extends Table> = Partial<T["$inferSelect"]>
type TableKey<T extends Table> = keyof T["_"]["columns"]
export type TableSQLUpdate<T extends Table> = Partial<Record<TableKey<T>, SQL>>

export class DrizzleService {
	static where<T extends Table>(table: TypeSafeTable<T>, obj: TableWhere<T>) {
		const keys = Object.keys(obj) as TableKey<T>[]

		if (!keys.length) throw new Error("No keys provided")

		if (keys.length === 1) {
			const key = keys[0]
			return eq(table[key], obj[key as keyof typeof obj])
		}

		return and(...keys.map(key => eq(table[key], obj[key as keyof typeof obj])))
	}

	static increment(column: AnyColumn, value: number) {
		if (value > 0) {
			return sql`${column} + ${value}`
		} else {
			return sql`${column} - ${Math.abs(value)}`
		}
	}
}
