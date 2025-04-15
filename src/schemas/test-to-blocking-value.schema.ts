import { TestToBlockingValue } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testToBlockingValueSchema = createSelectSchema(TestToBlockingValue)

export type TestToBlockingValueT = z.infer<typeof testToBlockingValueSchema>

export const insertTestToBlockingValueSchema = createInsertSchema(TestToBlockingValue).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestToBlockingValueT = z.infer<typeof insertTestToBlockingValueSchema>

export const updateTestToBlockingValueSchema = testToBlockingValueSchema.pick({ id: true }).merge(
	createUpdateSchema(TestToBlockingValue).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestToBlockingValueT = z.infer<typeof updateTestToBlockingValueSchema>
