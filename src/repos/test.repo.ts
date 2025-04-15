import { db } from "@/drizzle/db"
import { Test } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertTestT, TestT, UpdateTestT } from "../schemas"

export class TestRepo {
	static async insert(input: InsertTestT, tx?: TX) {
		const [newTest] = await (tx ?? db).insert(Test).values(input).returning()
		return newTest
	}

	static async update(id: TestT["id"], input: Omit<UpdateTestT, "id">, tx?: TX) {
		const [updatedTest] = await (tx ?? db).update(Test).set(input).where(eq(Test.id, id)).returning()
		return updatedTest
	}

	static async delete(id: TestT["id"], tx?: TX) {
		await (tx ?? db).delete(Test).where(eq(Test.id, id))
	}
}
