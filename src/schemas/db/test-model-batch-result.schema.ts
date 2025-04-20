import { TestModelBatchResult } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testModelBatchResultSchema = createSelectSchema(TestModelBatchResult)

export type TestModelBatchResultT = z.infer<typeof testModelBatchResultSchema>

export const insertTestModelBatchResultSchema = createInsertSchema(TestModelBatchResult).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestModelBatchResultT = z.infer<typeof insertTestModelBatchResultSchema>

export const updateTestModelBatchResultSchema = testModelBatchResultSchema.pick({ id: true }).merge(
	createUpdateSchema(TestModelBatchResult).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestModelBatchResultT = z.infer<typeof updateTestModelBatchResultSchema>
