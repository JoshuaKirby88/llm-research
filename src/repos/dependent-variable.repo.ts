import { db } from "@/drizzle/db"
import { DependentValue } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { DependentValueT, InsertDependentValueT, UpdateDependentValueT } from "../schemas"

export class DependentValueRepo {
	static async insert(input: InsertDependentValueT, tx?: TX) {
		const [newDependentValue] = await (tx ?? db).insert(DependentValue).values(input).returning()

		return newDependentValue
	}

	static async insertMany(input: InsertDependentValueT[], tx?: TX) {
		const newDependentValues = await (tx ?? db).insert(DependentValue).values(input).returning()

		return newDependentValues
	}

	static async update(id: DependentValueT["id"], input: Omit<UpdateDependentValueT, "id">, tx?: TX) {
		const [updatedDependentValue] = await (tx ?? db).update(DependentValue).set(input).where(eq(DependentValue.id, id)).returning()

		return updatedDependentValue
	}

	static async delete(id: DependentValueT["id"], tx?: TX) {
		await (tx ?? db).delete(DependentValue).where(eq(DependentValue.id, id))
	}
}
