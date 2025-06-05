import { db } from "@/drizzle/db"
import { TestBatchResult } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestBatchResultT, TestBatchResultT, UpdateTestBatchResultT } from "../schemas"

export class TestBatchResultRepo {
	static async insertMany(input: InsertTestBatchResultT[]) {
		const newTestBatchResults = await DrizzleService.batchInsert(TestBatchResult, input, items => db.insert(TestBatchResult).values(items).returning())
		return newTestBatchResults
	}

	static async update(id: TestBatchResultT["id"], input: Omit<UpdateTestBatchResultT, "id">) {
		const [updatedTestBatchResult] = await db.update(TestBatchResult).set(input).where(eq(TestBatchResult.id, id)).returning()
		return updatedTestBatchResult
	}

	static async delete(id: TestBatchResultT["id"]) {
		await db.delete(TestBatchResult).where(eq(TestBatchResult.id, id))
	}
}
