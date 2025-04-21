import { APIKey } from "@/drizzle/schema"
import { AIProvider } from "@/src/features"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const apiKeySchema = createSelectSchema(APIKey)

export type APIKeyT = z.infer<typeof apiKeySchema>

export const insertAPIKeySchema = createInsertSchema(APIKey).omit({
	createdAt: true,
	updatedAt: true,
})

export type InsertAPIKeyT = z.infer<typeof insertAPIKeySchema>

export const updateAPIKeySchema = apiKeySchema.pick({ userId: true }).merge(
	createUpdateSchema(APIKey).omit({
		userId: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateAPIKeyT = z.infer<typeof updateAPIKeySchema>

export type PartialAPIKeyT = Partial<Pick<APIKeyT, AIProvider>>

export type MaskedAPIKeyT = RequiredObj<APIKeyT>
