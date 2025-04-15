import { IndependentVariable } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const independentVariableSchema = createSelectSchema(IndependentVariable)

export type IndependentVariableT = z.infer<typeof independentVariableSchema>

export const insertIndependentVariableSchema = createInsertSchema(IndependentVariable).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertIndependentVariableT = z.infer<typeof insertIndependentVariableSchema>

export const updateIndependentVariableSchema = independentVariableSchema.pick({ id: true }).merge(createUpdateSchema(IndependentVariable).pick({ name: true, prompt: true }))

export type UpdateIndependentVariableT = z.infer<typeof updateIndependentVariableSchema>
