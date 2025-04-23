import { db } from "@/drizzle/db"
import { Test } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestT, TestT, UpdateTestT } from "../schemas"

export class TestRepo {
	static async insertMany(input: InsertTestT[], tx?: TX) {
		const newTests = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(Test).values(items).returning())
		return newTests
	}

	static async update(id: TestT["id"], input: Omit<UpdateTestT, "id">, tx?: TX) {
		const [updatedTest] = await (tx ?? db).update(Test).set(input).where(eq(Test.id, id)).returning()
		return updatedTest
	}

	static async delete(id: TestT["id"], tx?: TX) {
		await (tx ?? db).delete(Test).where(eq(Test.id, id))
	}
}
