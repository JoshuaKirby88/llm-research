import { db } from "@/drizzle/db"
import { TestModelBatch } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestModelBatchT, TestModelBatchT, UpdateTestModelBatchT } from "../schemas"

export class TestModelBatchRepo {
	static async insertMany(input: InsertTestModelBatchT[]) {
		const newTestModelBatches = await DrizzleService.batchInsert(TestModelBatch, input, items => db.insert(TestModelBatch).values(items).returning())

		return newTestModelBatches
	}

	static async update(id: TestModelBatchT["id"], input: Omit<UpdateTestModelBatchT, "id">) {
		const [updatedTestModelBatch] = await db.update(TestModelBatch).set(input).where(eq(TestModelBatch.id, id)).returning()

		return updatedTestModelBatch
	}

	static async delete(id: TestModelBatchT["id"]) {
		await db.delete(TestModelBatch).where(eq(TestModelBatch.id, id))
	}
}
