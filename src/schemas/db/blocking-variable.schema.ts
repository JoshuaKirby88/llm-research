import { BlockingVariable } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"
import { blockingValueSchema } from "./blocking-value.schema"

export const rawBlockingVariableSchema = createSelectSchema(BlockingVariable)

export const blockingVariableSchema = rawBlockingVariableSchema.extend({
	name: rawBlockingVariableSchema.shape.name.min(1),
})

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

export const blockingVariableCombinationSchema = blockingVariableSchema.extend({ blockingValue: blockingValueSchema }).array()

export type BlockingVariableCombinationT = z.infer<typeof blockingVariableCombinationSchema>
