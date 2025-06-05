import { db } from "@/drizzle/db"
import { TestModelBatchResult } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestModelBatchResultT, TestModelBatchResultT, UpdateTestModelBatchResultT } from "../schemas"

export class TestModelBatchResultRepo {
	static async insertMany(input: InsertTestModelBatchResultT[]) {
		const newTestModelBatchResults = await DrizzleService.batchInsert(TestModelBatchResult, input, items => db.insert(TestModelBatchResult).values(items).returning())
		return newTestModelBatchResults
	}

	static async update(id: TestModelBatchResultT["id"], input: Omit<UpdateTestModelBatchResultT, "id">) {
		const [updatedTestModelBatchResult] = await db.update(TestModelBatchResult).set(input).where(eq(TestModelBatchResult.id, id)).returning()
		return updatedTestModelBatchResult
	}

	static async delete(id: TestModelBatchResultT["id"]) {
		await db.delete(TestModelBatchResult).where(eq(TestModelBatchResult.id, id))
	}
}
