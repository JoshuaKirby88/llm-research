import { db } from "@/drizzle/db"
import { TestToBlockingValue } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestToBlockingValueT, TestToBlockingValueT, UpdateTestToBlockingValueT } from "../schemas"

export class TestToBlockingValueRepo {
	static async insertMany(input: InsertTestToBlockingValueT[], tx?: TX) {
		const newTestToBlockingValues = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(TestToBlockingValue).values(items).returning())
		return newTestToBlockingValues
	}

	static async update(id: TestToBlockingValueT["id"], input: Omit<UpdateTestToBlockingValueT, "id">, tx?: TX) {
		const [updatedTestToBlockingValue] = await (tx ?? db).update(TestToBlockingValue).set(input).where(eq(TestToBlockingValue.id, id)).returning()
		return updatedTestToBlockingValue
	}

	static async delete(id: TestToBlockingValueT["id"], tx?: TX) {
		await (tx ?? db).delete(TestToBlockingValue).where(eq(TestToBlockingValue.id, id))
	}
}
