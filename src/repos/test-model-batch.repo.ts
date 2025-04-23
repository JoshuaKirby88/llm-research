import { db } from "@/drizzle/db"
import { TestModelBatch } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestModelBatchT, TestModelBatchT, UpdateTestModelBatchT } from "../schemas"

export class TestModelBatchRepo {
	static async insertMany(input: InsertTestModelBatchT[], tx?: TX) {
		const newTestModelBatches = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(TestModelBatch).values(items).returning())

		return newTestModelBatches
	}

	static async update(id: TestModelBatchT["id"], input: Omit<UpdateTestModelBatchT, "id">, tx?: TX) {
		const [updatedTestModelBatch] = await (tx ?? db).update(TestModelBatch).set(input).where(eq(TestModelBatch.id, id)).returning()

		return updatedTestModelBatch
	}

	static async delete(id: TestModelBatchT["id"], tx?: TX) {
		await (tx ?? db).delete(TestModelBatch).where(eq(TestModelBatch.id, id))
	}
}
