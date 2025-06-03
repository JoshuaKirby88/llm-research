import { MessagePrompt } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const rawMessagePromptSchema = createSelectSchema(MessagePrompt)

export const messagePromptSchema = rawMessagePromptSchema.extend({
	text: rawMessagePromptSchema.shape.text.trim().min(1),
})

export type MessagePromptT = z.infer<typeof messagePromptSchema>

export const insertMessagePromptSchema = createInsertSchema(MessagePrompt).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertMessagePromptT = z.infer<typeof insertMessagePromptSchema>

export const updateMessagePromptSchema = messagePromptSchema.pick({ id: true }).merge(
	createUpdateSchema(MessagePrompt).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateMessagePromptT = z.infer<typeof updateMessagePromptSchema>
