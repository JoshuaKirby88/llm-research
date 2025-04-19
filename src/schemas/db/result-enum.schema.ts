import { ResultEnum } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const resultEnumSchema = createSelectSchema(ResultEnum)

export type ResultEnumT = z.infer<typeof resultEnumSchema>

export const insertResultEnumSchema = createInsertSchema(ResultEnum).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertResultEnumT = z.infer<typeof insertResultEnumSchema>

export const updateResultEnumSchema = resultEnumSchema.pick({ id: true }).merge(
	createUpdateSchema(ResultEnum).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateResultEnumT = z.infer<typeof updateResultEnumSchema>
