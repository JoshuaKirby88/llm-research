import { Test } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testSchema = createSelectSchema(Test)

export type TestT = z.infer<typeof testSchema>

export const insertTestSchema = createInsertSchema(Test).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestT = z.infer<typeof insertTestSchema>

export const updateTestSchema = testSchema.pick({ id: true }).merge(
	createUpdateSchema(Test).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestT = z.infer<typeof updateTestSchema>
