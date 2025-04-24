import { db } from "@/drizzle/db"
import { Test } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestT, TestT, UpdateTestT } from "../schemas"

export class TestRepo {
	static async insertMany(input: InsertTestT[]) {
		const newTests = await DrizzleService.batchInsert(input, items => db.insert(Test).values(items).returning())
		return newTests
	}

	static async update(id: TestT["id"], input: Omit<UpdateTestT, "id">) {
		const [updatedTest] = await db.update(Test).set(input).where(eq(Test.id, id)).returning()
		return updatedTest
	}

	static async delete(id: TestT["id"]) {
		await db.delete(Test).where(eq(Test.id, id))
	}
}
