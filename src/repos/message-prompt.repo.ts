import { db } from "@/drizzle/db"
import { MessagePrompt } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertMessagePromptT, MessagePromptT, UpdateMessagePromptT } from "../schemas"

export class MessagePromptRepo {
	static async insert(input: InsertMessagePromptT, tx?: TX) {
		const [newMessagePrompt] = await (tx ?? db).insert(MessagePrompt).values(input).returning()

		return newMessagePrompt
	}

	static async insertMany(input: InsertMessagePromptT[], tx?: TX) {
		const newMessagePrompts = await (tx ?? db).insert(MessagePrompt).values(input).returning()

		return newMessagePrompts
	}

	static async update(id: MessagePromptT["id"], input: Omit<UpdateMessagePromptT, "id">, tx?: TX) {
		const [updatedMessagePrompt] = await (tx ?? db).update(MessagePrompt).set(input).where(eq(MessagePrompt.id, id)).returning()

		return updatedMessagePrompt
	}

	static async delete(id: MessagePromptT["id"], tx?: TX) {
		await (tx ?? db).delete(MessagePrompt).where(eq(MessagePrompt.id, id))
	}
}
