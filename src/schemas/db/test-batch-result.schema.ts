import { TestBatchResult } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const testBatchResultSchema = createSelectSchema(TestBatchResult)

export type TestBatchResultT = z.infer<typeof testBatchResultSchema>

export const insertTestBatchResultSchema = createInsertSchema(TestBatchResult).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertTestBatchResultT = z.infer<typeof insertTestBatchResultSchema>

export const updateTestBatchResultSchema = testBatchResultSchema.pick({ id: true }).merge(
	createUpdateSchema(TestBatchResult).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateTestBatchResultT = z.infer<typeof updateTestBatchResultSchema>
