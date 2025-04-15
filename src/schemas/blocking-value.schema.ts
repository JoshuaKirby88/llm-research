import { BlockingValue } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const blockingValueSchema = createSelectSchema(BlockingValue)

export type BlockingValueT = z.infer<typeof blockingValueSchema>

export const insertBlockingValueSchema = createInsertSchema(BlockingValue).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertBlockingValueT = z.infer<typeof insertBlockingValueSchema>

export const updateBlockingValueSchema = blockingValueSchema.pick({ id: true }).merge(
	createUpdateSchema(BlockingValue).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateBlockingValueT = z.infer<typeof updateBlockingValueSchema>
