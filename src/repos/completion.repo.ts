import { db } from "@/drizzle/db"
import { Completion } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { CompletionT, InsertCompletionT, UpdateCompletionT } from "../schemas"

export class CompletionRepo {
	static async insert(input: InsertCompletionT, tx?: TX) {
		const [newCompletion] = await (tx ?? db).insert(Completion).values(input).returning()
		return newCompletion
	}

	static async update(id: CompletionT["id"], input: Omit<UpdateCompletionT, "id">, tx?: TX) {
		const [updatedCompletion] = await (tx ?? db).update(Completion).set(input).where(eq(Completion.id, id)).returning()
		return updatedCompletion
	}

	static async delete(id: CompletionT["id"], tx?: TX) {
		await (tx ?? db).delete(Completion).where(eq(Completion.id, id))
	}
}
