import { db } from "@/drizzle/db"
import { IndependentVariable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { IndependentVariableT, InsertIndependentVariableT, UpdateIndependentVariableT } from "../schemas"

export class IndependentVariableRepo {
	static async insert(input: InsertIndependentVariableT) {
		const [newIndependentVariable] = await db.insert(IndependentVariable).values(input).returning()

		return newIndependentVariable
	}

	static async update(id: IndependentVariableT["id"], input: Omit<UpdateIndependentVariableT, "id">) {
		const [updatedIndependentVariable] = await db.update(IndependentVariable).set(input).where(eq(IndependentVariable.id, id)).returning()

		return updatedIndependentVariable
	}

	static async delete(id: IndependentVariableT["id"]) {
		await db.delete(IndependentVariable).where(eq(IndependentVariable.id, id))
	}
}
