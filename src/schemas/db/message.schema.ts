import { Message } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const messageSchema = createSelectSchema(Message)

export type MessageT = z.infer<typeof messageSchema>

export const insertMessageSchema = createInsertSchema(Message).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertMessageT = z.infer<typeof insertMessageSchema>

export const updateMessageSchema = messageSchema.pick({ id: true }).merge(
	createUpdateSchema(Message).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateMessageT = z.infer<typeof updateMessageSchema>
