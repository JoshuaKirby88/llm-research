import { db } from "@/drizzle/db"
import { BlockingVariable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { BlockingVariableT, InsertBlockingVariableT, UpdateBlockingVariableT } from "../schemas"
import { DrizzleService } from "../services/drizzle.service"

export class BlockingVariableRepo {
	static async insert(input: InsertBlockingVariableT) {
		const [newBlockingVariable] = await db.insert(BlockingVariable).values(input).returning()

		return newBlockingVariable
	}

	static async insertMany(input: InsertBlockingVariableT[]) {
		const newBlockingVariables = await DrizzleService.batchInsert(BlockingVariable, input, items => db.insert(BlockingVariable).values(items).returning())

		return newBlockingVariables
	}

	static async update(id: BlockingVariableT["id"], input: Omit<UpdateBlockingVariableT, "id">) {
		const [updatedBlockingVariable] = await db.update(BlockingVariable).set(input).where(eq(BlockingVariable.id, id)).returning()

		return updatedBlockingVariable
	}

	static async delete(id: BlockingVariableT["id"]) {
		await db.delete(BlockingVariable).where(eq(BlockingVariable.id, id))
	}
}
