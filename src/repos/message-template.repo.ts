import { db } from "@/drizzle/db"
import { MessageTemplate } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { InsertMessageTemplateT, MessageTemplateT, UpdateMessageTemplateT } from "../schemas"

export class MessageTemplateRepo {
	static async insert(input: InsertMessageTemplateT) {
		const [newMessageTemplate] = await db.insert(MessageTemplate).values(input).returning()

		return newMessageTemplate
	}

	static async insertMany(input: InsertMessageTemplateT[]) {
		const newMessageTemplates = await DrizzleService.batchInsert(MessageTemplate, input, items => db.insert(MessageTemplate).values(items).returning())

		return newMessageTemplates
	}

	static async update(id: MessageTemplateT["id"], input: Omit<UpdateMessageTemplateT, "id">) {
		const [updatedMessageTemplate] = await db.update(MessageTemplate).set(input).where(eq(MessageTemplate.id, id)).returning()

		return updatedMessageTemplate
	}

	static async delete(id: MessageTemplateT["id"]) {
		await db.delete(MessageTemplate).where(eq(MessageTemplate.id, id))
	}
}
