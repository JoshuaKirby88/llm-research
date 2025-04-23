import { db } from "@/drizzle/db"
import { IndependentValue } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { IndependentValueT, InsertIndependentValueT, UpdateIndependentValueT } from "../schemas"

export class IndependentValueRepo {
	static async insert(input: InsertIndependentValueT, tx?: TX) {
		const [newIndependentValue] = await (tx ?? db).insert(IndependentValue).values(input).returning()

		return newIndependentValue
	}

	static async insertMany(input: InsertIndependentValueT[], tx?: TX) {
		const newIndependentValues = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(IndependentValue).values(items).returning())

		return newIndependentValues
	}

	static async update(id: IndependentValueT["id"], input: Omit<UpdateIndependentValueT, "id">, tx?: TX) {
		const [updatedIndependentValue] = await (tx ?? db).update(IndependentValue).set(input).where(eq(IndependentValue.id, id)).returning()

		return updatedIndependentValue
	}

	static async delete(id: IndependentValueT["id"], tx?: TX) {
		await (tx ?? db).delete(IndependentValue).where(eq(IndependentValue.id, id))
	}
}
