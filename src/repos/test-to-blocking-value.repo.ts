import { db } from "@/drizzle/db"
import { TestToBlockingValue } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertTestToBlockingValueT, TestToBlockingValueT, UpdateTestToBlockingValueT } from "../schemas"

export class TestToBlockingValueRepo {
	static async insert(input: InsertTestToBlockingValueT, tx?: TX) {
		const [newTestToBlockingValue] = await (tx ?? db).insert(TestToBlockingValue).values(input).returning()
		return newTestToBlockingValue
	}

	static async update(id: TestToBlockingValueT["id"], input: Omit<UpdateTestToBlockingValueT, "id">, tx?: TX) {
		const [updatedTestToBlockingValue] = await (tx ?? db).update(TestToBlockingValue).set(input).where(eq(TestToBlockingValue.id, id)).returning()
		return updatedTestToBlockingValue
	}

	static async delete(id: TestToBlockingValueT["id"], tx?: TX) {
		await (tx ?? db).delete(TestToBlockingValue).where(eq(TestToBlockingValue.id, id))
	}
}
