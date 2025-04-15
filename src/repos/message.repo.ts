import { db } from "@/drizzle/db"
import { Message } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertMessageT, MessageT, UpdateMessageT } from "../schemas"

export class MessageRepo {
	static async insert(input: InsertMessageT, tx?: TX) {
		const [newMessage] = await (tx ?? db).insert(Message).values(input).returning()
		return newMessage
	}

	static async update(id: MessageT["id"], input: Omit<UpdateMessageT, "id">, tx?: TX) {
		const [updatedMessage] = await (tx ?? db).update(Message).set(input).where(eq(Message.id, id)).returning()
		return updatedMessage
	}

	static async delete(id: MessageT["id"], tx?: TX) {
		await (tx ?? db).delete(Message).where(eq(Message.id, id))
	}
}
