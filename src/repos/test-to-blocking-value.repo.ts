import { db } from "@/drizzle/db"
import { TestToBlockingValue } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertTestToBlockingValueT, TestToBlockingValueT, UpdateTestToBlockingValueT } from "../schemas"

export class TestToBlockingValueRepo {
	static async insertMany(input: InsertTestToBlockingValueT[]) {
		const newTestToBlockingValues = await DrizzleService.batchInsert(TestToBlockingValue, input, items => db.insert(TestToBlockingValue).values(items).returning())
		return newTestToBlockingValues
	}

	static async update(id: TestToBlockingValueT["id"], input: Omit<UpdateTestToBlockingValueT, "id">) {
		const [updatedTestToBlockingValue] = await db.update(TestToBlockingValue).set(input).where(eq(TestToBlockingValue.id, id)).returning()
		return updatedTestToBlockingValue
	}

	static async delete(id: TestToBlockingValueT["id"]) {
		await db.delete(TestToBlockingValue).where(eq(TestToBlockingValue.id, id))
	}
}
