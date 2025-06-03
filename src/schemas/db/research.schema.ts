import { Research } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

const rawResearchSchema = createSelectSchema(Research)

export const researchSchema = rawResearchSchema.extend({
	name: rawResearchSchema.shape.name.trim().min(1),
})

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

export const researchVectorSchema = z.object({
	id: researchSchema.shape.id,
	values: z.number().array(),
})

export type ResearchVectorT = z.infer<typeof researchVectorSchema>

export const insertResearchVectorSchema = researchVectorSchema

export type InsertResearchVectorT = z.infer<typeof insertResearchVectorSchema>

export const updateResearchAndVectorSchema = researchSchema.pick({ id: true, name: true, description: true }).merge(updateResearchSchema.pick({ conclusion: true }))

export type UpdateResearchAndVectorT = z.infer<typeof updateResearchAndVectorSchema>
