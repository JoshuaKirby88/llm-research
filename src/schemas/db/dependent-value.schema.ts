import { DependentValue } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const dependentValueSchema = createSelectSchema(DependentValue)

export type DependentValueT = z.infer<typeof dependentValueSchema>

export const insertDependentValueSchema = createInsertSchema(DependentValue).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertDependentValueT = z.infer<typeof insertDependentValueSchema>

export const updateDependentValueSchema = dependentValueSchema.pick({ id: true }).merge(
	createUpdateSchema(DependentValue).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateDependentValueT = z.infer<typeof updateDependentValueSchema>
