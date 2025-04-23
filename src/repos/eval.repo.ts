import { db } from "@/drizzle/db"
import { Eval } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { EvalT, InsertEvalT, UpdateEvalT } from "../schemas"

export class EvalRepo {
	static async insertMany(input: InsertEvalT[], tx?: TX) {
		const newEvals = await DrizzleService.batchInsert(input, items => (tx ?? db).insert(Eval).values(items).returning())
		return newEvals
	}

	static async update(id: EvalT["id"], input: Omit<UpdateEvalT, "id">, tx?: TX) {
		const [updatedEval] = await (tx ?? db).update(Eval).set(input).where(eq(Eval.id, id)).returning()
		return updatedEval
	}

	static async delete(id: EvalT["id"], tx?: TX) {
		await (tx ?? db).delete(Eval).where(eq(Eval.id, id))
	}
}
