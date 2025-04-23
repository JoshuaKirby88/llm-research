import { Eval } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const evaleSchema = createSelectSchema(Eval)

export type EvalT = z.infer<typeof evaleSchema>

export const insertEvalSchema = createInsertSchema(Eval).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertEvalT = z.infer<typeof insertEvalSchema>

export const updateEvalSchema = evaleSchema.pick({ id: true }).merge(
	createUpdateSchema(Eval).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateEvalT = z.infer<typeof updateEvalSchema>
