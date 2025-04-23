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

export const insertGeneratedMessageSchema = insertMessageSchema.extend({
	isCompletion: z.literal(false),
	messagePromptId: insertMessageSchema.shape.messagePromptId.unwrap().unwrap(),
})

export type InsertGeneratedMessageT = z.infer<typeof insertGeneratedMessageSchema>

export const insertCompletionMessageSchema = insertMessageSchema.extend({
	isCompletion: z.literal(true),
	messagePromptId: z.null().optional(),
})

export type InsertCompletionMessageT = z.infer<typeof insertCompletionMessageSchema>

export const updateMessageSchema = messageSchema.pick({ id: true }).merge(
	createUpdateSchema(Message).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateMessageT = z.infer<typeof updateMessageSchema>
