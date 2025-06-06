import { db } from "@/drizzle/db"
import { AnyColumn, InferInsertModel, SQL, Table, and, eq, getTableColumns, sql } from "drizzle-orm"

type TypeSafeTable<T extends Table> = T & Record<TableKey<T>, T["_"]["columns"][TableKey<T>]>
export type TableWhere<T extends Table> = Partial<T["$inferSelect"]>
type TableKey<T extends Table> = keyof T["_"]["columns"]
export type TableSQLUpdate<T extends Table> = Partial<Record<TableKey<T>, SQL>>
export type TableMixedSQLUpdate<U> = {
	[K in keyof U]?: U[K] | SQL
}

export class DrizzleService {
	private static maxSQLVariables = 100

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

	static async batchInsert<T extends Table, I extends InferInsertModel<T>, K extends { id: number }>(table: T, items: I[], callback: (args: I[]) => Promise<K[]>) {
		const columns = getTableColumns(table)
		const defaultColumns = Object.entries(columns)
			.filter(([_, v]) => v.hasDefault)
			.map(([k]) => k)

		let chunkArgsLength = 0
		const chunks: I[][] = [[]]

		for (const item of items) {
			const args = Array.from(new Set([...Object.keys(item), ...defaultColumns]))

			if (chunkArgsLength + args.length >= this.maxSQLVariables) {
				chunks.push([item])
				chunkArgsLength = args.length
				continue
			}

			chunks[chunks.length - 1].push(item)
			chunkArgsLength += args.length
		}

		const chunkedResults: K[][] = await db.batch(chunks.map(chunk => callback(chunk)) as any)
		const results = chunkedResults.flat()

		if (typeof results[0] === "object" && results[0] && "id" in results[0]) {
			results.sort((a, b) => a.id - b.id)
		}

		return results
	}

	static async updateMany<T extends Table, K extends keyof T["_"]["columns"]>(table: T, values: Array<{ id: number } & Record<K, T["$inferSelect"][K]>>, key: K) {
		const sqlChunks: SQL[] = [sql`(case`, ...values.map(value => sql`when ${table["id" as keyof T]} = ${value.id} then ${value[key]}`), sql`end)`]
		const updateSql: SQL = sql.join(sqlChunks, sql.raw(" "))
		return updateSql
	}
}
