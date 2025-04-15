import { db } from "@/drizzle/db"
import { TestBatch } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertTestBatchT, TestBatchT, UpdateTestBatchT } from "../schemas"

export class TestBatchRepo {
	static async insert(input: InsertTestBatchT, tx?: TX) {
		const [newTestBatch] = await (tx ?? db).insert(TestBatch).values(input).returning()

		return newTestBatch
	}

	static async update(id: TestBatchT["id"], input: Omit<UpdateTestBatchT, "id">, tx?: TX) {
		const [updatedTestBatch] = await (tx ?? db).update(TestBatch).set(input).where(eq(TestBatch.id, id)).returning()

		return updatedTestBatch
	}

	static async delete(id: TestBatchT["id"], tx?: TX) {
		await (tx ?? db).delete(TestBatch).where(eq(TestBatch.id, id))
	}
}
