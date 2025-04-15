import { db } from "@/drizzle/db"
import { EvalPrompt } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { EvalPromptT, InsertEvalPromptT, UpdateEvalPromptT } from "../schemas"

export class EvalPromptRepo {
	static async insert(input: InsertEvalPromptT, tx?: TX) {
		const [newEvalPrompt] = await (tx ?? db).insert(EvalPrompt).values(input).returning()

		return newEvalPrompt
	}

	static async update(id: EvalPromptT["id"], input: Omit<UpdateEvalPromptT, "id">, tx?: TX) {
		const [updatedEvalPrompt] = await (tx ?? db).update(EvalPrompt).set(input).where(eq(EvalPrompt.id, id)).returning()

		return updatedEvalPrompt
	}

	static async delete(id: EvalPromptT["id"], tx?: TX) {
		await (tx ?? db).delete(EvalPrompt).where(eq(EvalPrompt.id, id))
	}
}
