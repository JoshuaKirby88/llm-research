import { db } from "@/drizzle/db"
import { TestBatchResult } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestBatchResultT, TestBatchResultT, UpdateTestBatchResultT } from "../schemas"

export class TestBatchResultRepo {
	static async insertMany(input: InsertTestBatchResultT[], tx?: TX) {
		const newTestBatchResults = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(TestBatchResult).values(items).returning())
		return newTestBatchResults
	}

	static async update(id: TestBatchResultT["id"], input: Omit<UpdateTestBatchResultT, "id">, tx?: TX) {
		const [updatedTestBatchResult] = await (tx ?? db).update(TestBatchResult).set(input).where(eq(TestBatchResult.id, id)).returning()
		return updatedTestBatchResult
	}

	static async delete(id: TestBatchResultT["id"], tx?: TX) {
		await (tx ?? db).delete(TestBatchResult).where(eq(TestBatchResult.id, id))
	}
}
