import { UserToStarredResearch } from "@/drizzle/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const userToStarredResearchSchema = createSelectSchema(UserToStarredResearch)

export type UserToStarredResearchT = z.infer<typeof userToStarredResearchSchema>

export const insertUserToStarredResearchSchema = createInsertSchema(UserToStarredResearch).omit({
	createdAt: true,
	updatedAt: true,
})

export type InsertUserToStarredResearchT = z.infer<typeof insertUserToStarredResearchSchema>
