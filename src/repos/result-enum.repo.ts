import { db } from "@/drizzle/db"
import { ResultEnum } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertResultEnumT, ResultEnumT, UpdateResultEnumT } from "../schemas"

export class ResultEnumRepo {
	static async insert(input: InsertResultEnumT, tx?: TX) {
		const [newResultEnum] = await (tx ?? db).insert(ResultEnum).values(input).returning()

		return newResultEnum
	}

	static async insertMany(input: InsertResultEnumT[], tx?: TX) {
		const newResultEnums = await (tx ?? db).insert(ResultEnum).values(input).returning()

		return newResultEnums
	}

	static async update(id: ResultEnumT["id"], input: Omit<UpdateResultEnumT, "id">, tx?: TX) {
		const [updatedResultEnum] = await (tx ?? db).update(ResultEnum).set(input).where(eq(ResultEnum.id, id)).returning()

		return updatedResultEnum
	}

	static async delete(id: ResultEnumT["id"], tx?: TX) {
		await (tx ?? db).delete(ResultEnum).where(eq(ResultEnum.id, id))
	}
}
