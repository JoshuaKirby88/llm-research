import { Contributor } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const contributorSchema = createSelectSchema(Contributor)

export type ContributorT = z.infer<typeof contributorSchema>

export const insertContributorSchema = createInsertSchema(Contributor).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertContributorT = z.infer<typeof insertContributorSchema>

export const updateContributorSchema = contributorSchema.pick({ id: true }).merge(
	createUpdateSchema(Contributor).omit({
		isOwner: true,
		userId: true,
		researchId: true,
		createdAt: true,
		updatedAt: true,
	}),
)

export type UpdateContributorT = z.infer<typeof updateContributorSchema>
