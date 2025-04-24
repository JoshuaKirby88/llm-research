import { db } from "@/drizzle/db"
import { EvalPrompt } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { EvalPromptT, InsertEvalPromptT, UpdateEvalPromptT } from "../schemas"

export class EvalPromptRepo {
	static async insert(input: InsertEvalPromptT) {
		const [newEvalPrompt] = await db.insert(EvalPrompt).values(input).returning()

		return newEvalPrompt
	}

	static async update(id: EvalPromptT["id"], input: Omit<UpdateEvalPromptT, "id">) {
		const [updatedEvalPrompt] = await db.update(EvalPrompt).set(input).where(eq(EvalPrompt.id, id)).returning()

		return updatedEvalPrompt
	}

	static async delete(id: EvalPromptT["id"]) {
		await db.delete(EvalPrompt).where(eq(EvalPrompt.id, id))
	}
}
