import { db } from "@/drizzle/db"
import { BlockingVariable } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { BlockingVariableT, InsertBlockingVariableT, UpdateBlockingVariableT } from "../schemas"
import { DrizzleService } from "../services/drizzle.service"

export class BlockingVariableRepo {
	static async insert(input: InsertBlockingVariableT, tx?: TX) {
		const [newBlockingVariable] = await (tx ?? db).insert(BlockingVariable).values(input).returning()

		return newBlockingVariable
	}

	static async insertMany(input: InsertBlockingVariableT[], tx?: TX) {
		const newBlockingVariables = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(BlockingVariable).values(items).returning())

		return newBlockingVariables
	}

	static async update(id: BlockingVariableT["id"], input: Omit<UpdateBlockingVariableT, "id">, tx?: TX) {
		const [updatedBlockingVariable] = await (tx ?? db).update(BlockingVariable).set(input).where(eq(BlockingVariable.id, id)).returning()

		return updatedBlockingVariable
	}

	static async delete(id: BlockingVariableT["id"], tx?: TX) {
		await (tx ?? db).delete(BlockingVariable).where(eq(BlockingVariable.id, id))
	}
}
