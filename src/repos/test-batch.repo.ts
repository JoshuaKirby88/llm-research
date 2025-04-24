import { db } from "@/drizzle/db"
import { TestBatch } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { InsertTestBatchT, TestBatchT, UpdateTestBatchT } from "../schemas"

export class TestBatchRepo {
	static async insert(input: InsertTestBatchT) {
		const [newTestBatch] = await db.insert(TestBatch).values(input).returning()

		return newTestBatch
	}

	static async update(id: TestBatchT["id"], input: Omit<UpdateTestBatchT, "id">) {
		const [updatedTestBatch] = await db.update(TestBatch).set(input).where(eq(TestBatch.id, id)).returning()

		return updatedTestBatch
	}

	static async delete(id: TestBatchT["id"]) {
		await db.delete(TestBatch).where(eq(TestBatch.id, id))
	}
}
