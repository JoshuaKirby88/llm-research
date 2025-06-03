import { EvalPrompt } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const rawEvalPromptSchema = createSelectSchema(EvalPrompt)

export const evalPromptSchema = rawEvalPromptSchema.extend({
	text: rawEvalPromptSchema.shape.text.trim().min(1),
})

export type EvalPromptT = z.infer<typeof evalPromptSchema>

export const insertEvalPromptSchema = createInsertSchema(EvalPrompt).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertEvalPromptT = z.infer<typeof insertEvalPromptSchema>

export const updateEvalPromptSchema = evalPromptSchema.pick({ id: true }).merge(
	createUpdateSchema(EvalPrompt).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateEvalPromptT = z.infer<typeof updateEvalPromptSchema>
