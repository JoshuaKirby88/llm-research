import { db } from "@/drizzle/db"
import { TestModelBatchResult } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertTestModelBatchResultT, TestModelBatchResultT, UpdateTestModelBatchResultT } from "../schemas"

export class TestModelBatchResultRepo {
	static async insertMany(input: InsertTestModelBatchResultT[], tx?: TX) {
		const newTestModelBatchResults = await (tx ?? db).insert(TestModelBatchResult).values(input).returning()
		return newTestModelBatchResults.sort((a, b) => a.id - b.id)
	}

	static async update(id: TestModelBatchResultT["id"], input: Omit<UpdateTestModelBatchResultT, "id">, tx?: TX) {
		const [updatedTestModelBatchResult] = await (tx ?? db).update(TestModelBatchResult).set(input).where(eq(TestModelBatchResult.id, id)).returning()
		return updatedTestModelBatchResult
	}

	static async delete(id: TestModelBatchResultT["id"], tx?: TX) {
		await (tx ?? db).delete(TestModelBatchResult).where(eq(TestModelBatchResult.id, id))
	}
}
