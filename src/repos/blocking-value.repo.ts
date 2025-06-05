import { db } from "@/drizzle/db"
import { BlockingValue } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { BlockingValueT, InsertBlockingValueT, UpdateBlockingValueT } from "../schemas"
import { DrizzleService } from "../services/drizzle.service"

export class BlockingValueRepo {
	static async insert(input: InsertBlockingValueT) {
		const [newBlockingValue] = await db.insert(BlockingValue).values(input).returning()

		return newBlockingValue
	}

	static async insertMany(input: InsertBlockingValueT[]) {
		const newBlockingValues = await DrizzleService.batchInsert(BlockingValue, input, items => db.insert(BlockingValue).values(items).returning())

		return newBlockingValues
	}

	static async update(id: BlockingValueT["id"], input: Omit<UpdateBlockingValueT, "id">) {
		const [updatedBlockingValue] = await db.update(BlockingValue).set(input).where(eq(BlockingValue.id, id)).returning()

		return updatedBlockingValue
	}

	static async delete(id: BlockingValueT["id"]) {
		await db.delete(BlockingValue).where(eq(BlockingValue.id, id))
	}
}
