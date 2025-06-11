import { Request } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const requestSchema = createSelectSchema(Request)

export type RequestT = z.infer<typeof requestSchema>

export const insertRequestSchema = createInsertSchema(Request).omit({
	createdAt: true,
	updatedAt: true,
})

export type InsertRequestT = z.infer<typeof insertRequestSchema>

export const updateRequestSchema = requestSchema.pick({ id: true }).merge(
	createUpdateSchema(Request).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateRequestT = z.infer<typeof updateRequestSchema>

export const successRequestSchema = requestSchema.extend({
	isLoading: z.literal(false),
	successId: z.number(),
})

export type SuccessRequestT = z.infer<typeof successRequestSchema>

export const errorRequestSchema = requestSchema.extend({
	isLoading: z.literal(false),
	error: z.string(),
})

export type ErrorRequestT = z.infer<typeof errorRequestSchema>
