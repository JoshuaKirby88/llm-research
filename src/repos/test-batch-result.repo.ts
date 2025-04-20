import { db } from "@/drizzle/db"
import { TestBatchResult } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertTestBatchResultT, TestBatchResultT, UpdateTestBatchResultT } from "../schemas"

export class TestBatchResultRepo {
	static async insertMany(input: InsertTestBatchResultT[], tx?: TX) {
		const newTestBatchResults = await (tx ?? db).insert(TestBatchResult).values(input).returning()
		return newTestBatchResults.sort((a, b) => a.id - b.id)
	}

	static async update(id: TestBatchResultT["id"], input: Omit<UpdateTestBatchResultT, "id">, tx?: TX) {
		const [updatedTestBatchResult] = await (tx ?? db).update(TestBatchResult).set(input).where(eq(TestBatchResult.id, id)).returning()
		return updatedTestBatchResult
	}

	static async delete(id: TestBatchResultT["id"], tx?: TX) {
		await (tx ?? db).delete(TestBatchResult).where(eq(TestBatchResult.id, id))
	}
}
