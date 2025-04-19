import { TestBatch } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testBatchSchema = createSelectSchema(TestBatch)

export type TestBatchT = z.infer<typeof testBatchSchema>

export const insertTestBatchSchema = createInsertSchema(TestBatch).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestBatchT = z.infer<typeof insertTestBatchSchema>

export const updateTestBatchSchema = testBatchSchema.pick({ id: true }).merge(
	createUpdateSchema(TestBatch).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestBatchT = z.infer<typeof updateTestBatchSchema>
