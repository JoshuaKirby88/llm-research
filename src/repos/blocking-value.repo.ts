import { db } from "@/drizzle/db"
import { BlockingValue } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { BlockingValueT, InsertBlockingValueT, UpdateBlockingValueT } from "../schemas"
import { DrizzleService } from "../services/drizzle.service"

export class BlockingValueRepo {
	static async insert(input: InsertBlockingValueT, tx?: TX) {
		const [newBlockingValue] = await (tx ?? db).insert(BlockingValue).values(input).returning()

		return newBlockingValue
	}

	static async insertMany(input: InsertBlockingValueT[], tx?: TX) {
		const newBlockingValues = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(BlockingValue).values(items).returning())

		return newBlockingValues
	}

	static async update(id: BlockingValueT["id"], input: Omit<UpdateBlockingValueT, "id">, tx?: TX) {
		const [updatedBlockingValue] = await (tx ?? db).update(BlockingValue).set(input).where(eq(BlockingValue.id, id)).returning()

		return updatedBlockingValue
	}

	static async delete(id: BlockingValueT["id"], tx?: TX) {
		await (tx ?? db).delete(BlockingValue).where(eq(BlockingValue.id, id))
	}
}
