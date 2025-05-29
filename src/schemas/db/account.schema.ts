import { Account } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const accountSchema = createSelectSchema(Account)

export type AccountT = z.infer<typeof accountSchema>

export const insertAccountSchema = createInsertSchema(Account).omit({
	createdAt: true,
	updatedAt: true,
})

export type InsertAccountT = z.infer<typeof insertAccountSchema>

export const updateAccountSchema = accountSchema.pick({ userId: true }).merge(
	createUpdateSchema(Account).omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateAccountT = z.infer<typeof updateAccountSchema>
