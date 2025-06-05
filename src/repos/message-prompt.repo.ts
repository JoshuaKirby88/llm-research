import { db } from "@/drizzle/db"
import { MessagePrompt } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertMessagePromptT, MessagePromptT, UpdateMessagePromptT } from "../schemas"

export class MessagePromptRepo {
	static async insert(input: InsertMessagePromptT) {
		const [newMessagePrompt] = await db.insert(MessagePrompt).values(input).returning()

		return newMessagePrompt
	}

	static async insertMany(input: InsertMessagePromptT[]) {
		const newMessagePrompts = await DrizzleService.batchInsert(MessagePrompt, input, items => db.insert(MessagePrompt).values(items).returning())

		return newMessagePrompts
	}

	static async update(id: MessagePromptT["id"], input: Omit<UpdateMessagePromptT, "id">) {
		const [updatedMessagePrompt] = await db.update(MessagePrompt).set(input).where(eq(MessagePrompt.id, id)).returning()

		return updatedMessagePrompt
	}

	static async delete(id: MessagePromptT["id"]) {
		await db.delete(MessagePrompt).where(eq(MessagePrompt.id, id))
	}
}
