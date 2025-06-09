import { db } from "@/drizzle/db"
import { Message } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"
import { MessageT, RawInsertMessageT, UpdateMessageT } from "../schemas"

export class MessageRepo {
	static async insertMany(input: RawInsertMessageT[]) {
		const newMessages = await DrizzleService.batchInsert(Message, input, items => db.insert(Message).values(items).returning())
		return newMessages
	}

	static async update(id: MessageT["id"], input: Omit<UpdateMessageT, "id">) {
		const [updatedMessage] = await db.update(Message).set(input).where(eq(Message.id, id)).returning()
		return updatedMessage
	}

	static async delete(id: MessageT["id"]) {
		await db.delete(Message).where(eq(Message.id, id))
	}
}
