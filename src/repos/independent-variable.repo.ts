import { db } from "@/drizzle/db"
import { IndependentVariable } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { IndependentVariableT, InsertIndependentVariableT, UpdateIndependentVariableT } from "../schemas"

export class IndependentVariableRepo {
	static async insert(input: InsertIndependentVariableT, tx?: TX) {
		const [newIndependentVariable] = await (tx ?? db).insert(IndependentVariable).values(input).returning()

		return newIndependentVariable
	}

	static async update(id: IndependentVariableT["id"], input: Omit<UpdateIndependentVariableT, "id">, tx?: TX) {
		const [updatedIndependentVariable] = await (tx ?? db).update(IndependentVariable).set(input).where(eq(IndependentVariable.id, id)).returning()

		return updatedIndependentVariable
	}

	static async delete(id: IndependentVariableT["id"], tx?: TX) {
		await (tx ?? db).delete(IndependentVariable).where(eq(IndependentVariable.id, id))
	}
}
