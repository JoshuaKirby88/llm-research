import { BlockingVariable } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const blockingVariableSchema = createSelectSchema(BlockingVariable)

export type BlockingVariableT = z.infer<typeof blockingVariableSchema>

export const insertBlockingVariableSchema = createInsertSchema(BlockingVariable).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertBlockingVariableT = z.infer<typeof insertBlockingVariableSchema>

export const updateBlockingVariableSchema = blockingVariableSchema.pick({ id: true }).merge(
	createUpdateSchema(BlockingVariable).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateBlockingVariableT = z.infer<typeof updateBlockingVariableSchema>
