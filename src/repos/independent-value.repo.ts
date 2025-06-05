import { db } from "@/drizzle/db"
import { IndependentValue } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { IndependentValueT, InsertIndependentValueT, UpdateIndependentValueT } from "../schemas"

export class IndependentValueRepo {
	static async insert(input: InsertIndependentValueT) {
		const [newIndependentValue] = await db.insert(IndependentValue).values(input).returning()

		return newIndependentValue
	}

	static async insertMany(input: InsertIndependentValueT[]) {
		const newIndependentValues = await DrizzleService.batchInsert(IndependentValue, input, items => db.insert(IndependentValue).values(items).returning())

		return newIndependentValues
	}

	static async update(id: IndependentValueT["id"], input: Omit<UpdateIndependentValueT, "id">) {
		const [updatedIndependentValue] = await db.update(IndependentValue).set(input).where(eq(IndependentValue.id, id)).returning()

		return updatedIndependentValue
	}

	static async delete(id: IndependentValueT["id"]) {
		await db.delete(IndependentValue).where(eq(IndependentValue.id, id))
	}
}
