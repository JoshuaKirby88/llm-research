import { Research } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const researchSchema = createSelectSchema(Research)

export type ResearchT = z.infer<typeof researchSchema>

export const insertResearchSchema = createInsertSchema(Research).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertResearchT = z.infer<typeof insertResearchSchema>

export const updateResearchSchema = researchSchema.pick({ id: true }).merge(
	createUpdateSchema(Research).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateResearchT = z.infer<typeof updateResearchSchema>
