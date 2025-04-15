import { IndependentValue } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const independentValueSchema = createSelectSchema(IndependentValue)

export type IndependentValueT = z.infer<typeof independentValueSchema>

export const insertIndependentValueSchema = createInsertSchema(IndependentValue).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertIndependentValueT = z.infer<typeof insertIndependentValueSchema>

export const updateIndependentValueSchema = independentValueSchema.pick({ id: true }).merge(
	createUpdateSchema(IndependentValue).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateIndependentValueT = z.infer<typeof updateIndependentValueSchema>
