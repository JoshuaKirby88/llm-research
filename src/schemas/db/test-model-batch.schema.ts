import { TestModelBatch } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testModelBatchSchema = createSelectSchema(TestModelBatch)

export type TestModelBatchT = z.infer<typeof testModelBatchSchema>

export const insertTestModelBatchSchema = createInsertSchema(TestModelBatch).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestModelBatchT = z.infer<typeof insertTestModelBatchSchema>

export const updateTestModelBatchSchema = testModelBatchSchema.pick({ id: true }).merge(
	createUpdateSchema(TestModelBatch).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestModelBatchT = z.infer<typeof updateTestModelBatchSchema>
