import { MessageTemplate } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const rawMessageTemplateSchema = createSelectSchema(MessageTemplate)

export const messageTemplateSchema = rawMessageTemplateSchema.extend({
	text: rawMessageTemplateSchema.shape.text.trim().min(1),
})

export type MessageTemplateT = z.infer<typeof messageTemplateSchema>

export const insertMessageTemplateSchema = createInsertSchema(MessageTemplate).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertMessageTemplateT = z.infer<typeof insertMessageTemplateSchema>

export const updateMessageTemplateSchema = messageTemplateSchema.pick({ id: true }).merge(
	createUpdateSchema(MessageTemplate).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateMessageTemplateT = z.infer<typeof updateMessageTemplateSchema>
