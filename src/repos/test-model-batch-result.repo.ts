import { db } from "@/drizzle/db"
import { TestModelBatchResult } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestModelBatchResultT, TestModelBatchResultT, UpdateTestModelBatchResultT } from "../schemas"

export class TestModelBatchResultRepo {
	static async insertMany(input: InsertTestModelBatchResultT[], tx?: TX) {
		const newTestModelBatchResults = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(TestModelBatchResult).values(items).returning())
		return newTestModelBatchResults
	}

	static async update(id: TestModelBatchResultT["id"], input: Omit<UpdateTestModelBatchResultT, "id">, tx?: TX) {
		const [updatedTestModelBatchResult] = await (tx ?? db).update(TestModelBatchResult).set(input).where(eq(TestModelBatchResult.id, id)).returning()
		return updatedTestModelBatchResult
	}

	static async delete(id: TestModelBatchResultT["id"], tx?: TX) {
		await (tx ?? db).delete(TestModelBatchResult).where(eq(TestModelBatchResult.id, id))
	}
}
