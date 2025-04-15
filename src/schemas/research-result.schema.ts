import { ResearchResult } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const researchResultSchema = createSelectSchema(ResearchResult)

export type ResearchResultT = z.infer<typeof researchResultSchema>

export const insertResearchResultSchema = createInsertSchema(ResearchResult).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertResearchResultT = z.infer<typeof insertResearchResultSchema>

export const updateResearchResultSchema = researchResultSchema.pick({ id: true }).merge(
	createUpdateSchema(ResearchResult).omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateResearchResultT = z.infer<typeof updateResearchResultSchema>
