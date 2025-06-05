import { db } from "@/drizzle/db"
import { Eval } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { EvalT, InsertEvalT, UpdateEvalT } from "../schemas"

export class EvalRepo {
	static async insertMany(input: InsertEvalT[]) {
		const newEvals = await DrizzleService.batchInsert(Eval, input, items => db.insert(Eval).values(items).returning())
		return newEvals
	}

	static async update(id: EvalT["id"], input: Omit<UpdateEvalT, "id">) {
		const [updatedEval] = await db.update(Eval).set(input).where(eq(Eval.id, id)).returning()
		return updatedEval
	}

	static async delete(id: EvalT["id"]) {
		await db.delete(Eval).where(eq(Eval.id, id))
	}
}
