import { db } from "@/drizzle/db"
import { DependentValue } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { DependentValueT, InsertDependentValueT, UpdateDependentValueT } from "../schemas"

export class DependentValueRepo {
	static async insert(input: InsertDependentValueT) {
		const [newDependentValue] = await db.insert(DependentValue).values(input).returning()

		return newDependentValue
	}

	static async insertMany(input: InsertDependentValueT[]) {
		const newDependentValues = await DrizzleService.batchInsert(input, items => db.insert(DependentValue).values(items).returning())

		return newDependentValues
	}

	static async update(id: DependentValueT["id"], input: Omit<UpdateDependentValueT, "id">) {
		const [updatedDependentValue] = await db.update(DependentValue).set(input).where(eq(DependentValue.id, id)).returning()

		return updatedDependentValue
	}

	static async delete(id: DependentValueT["id"]) {
		await db.delete(DependentValue).where(eq(DependentValue.id, id))
	}
}
