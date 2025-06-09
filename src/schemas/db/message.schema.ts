import { Message } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

const rawMessageSchema = createSelectSchema(Message).extend({
	content: z.string().trim(),
})

const messageSchema = z.union([
	rawMessageSchema.extend({
		type: z.literal("raw"),
		promptTokens: z.null(),
		completionTokens: z.null(),
		messageTemplateId: rawMessageSchema.shape.messageTemplateId.unwrap(),
	}),
	rawMessageSchema.extend({
		type: z.literal("generated"),
		promptTokens: rawMessageSchema.shape.promptTokens.unwrap(),
		completionTokens: rawMessageSchema.shape.completionTokens.unwrap(),
		messageTemplateId: rawMessageSchema.shape.messageTemplateId.unwrap(),
	}),
	rawMessageSchema.extend({
		type: z.literal("completion"),
		role: z.literal("assistant"),
		promptTokens: rawMessageSchema.shape.promptTokens.unwrap(),
		completionTokens: rawMessageSchema.shape.completionTokens.unwrap(),
		messageTemplateId: z.null(),
	}),
])

export type MessageT = z.infer<typeof messageSchema>

const rawInsertMessageSchema = createInsertSchema(Message).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type RawInsertMessageT = z.infer<typeof rawInsertMessageSchema>

const insertMessageSchema = z.union([
	rawInsertMessageSchema.extend({
		type: z.literal("raw"),
		promptTokens: z.null().optional(),
		completionTokens: z.null().optional(),
		messageTemplateId: rawInsertMessageSchema.shape.messageTemplateId.unwrap().unwrap(),
	}),
	rawInsertMessageSchema.extend({
		type: z.literal("generated"),
		promptTokens: rawInsertMessageSchema.shape.promptTokens.unwrap().unwrap(),
		completionTokens: rawInsertMessageSchema.shape.completionTokens.unwrap().unwrap(),
		messageTemplateId: rawInsertMessageSchema.shape.messageTemplateId.unwrap().unwrap(),
	}),
	rawInsertMessageSchema.extend({
		type: z.literal("completion"),
		role: z.literal("assistant"),
		promptTokens: rawInsertMessageSchema.shape.promptTokens.unwrap().unwrap(),
		completionTokens: rawInsertMessageSchema.shape.completionTokens.unwrap().unwrap(),
		messageTemplateId: z.null().optional(),
	}),
])

export type InsertMessageT = z.infer<typeof insertMessageSchema>

export const updateMessageSchema = rawMessageSchema.pick({ id: true }).merge(
	createUpdateSchema(Message).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateMessageT = z.infer<typeof updateMessageSchema>
