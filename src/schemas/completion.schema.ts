import { Completion } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const completionSchema = createSelectSchema(Completion)

export type CompletionT = z.infer<typeof completionSchema>

export const insertCompletionSchema = createInsertSchema(Completion).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertCompletionT = z.infer<typeof insertCompletionSchema>

export const updateCompletionSchema = completionSchema.pick({ id: true }).merge(
	createUpdateSchema(Completion).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateCompletionT = z.infer<typeof updateCompletionSchema>
