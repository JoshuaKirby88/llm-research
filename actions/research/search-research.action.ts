"use server"

import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { AIService } from "@/src/services/ai.service"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { and, desc, eq, inArray } from "drizzle-orm"
import { z } from "zod"

export const searchResearchAction = createAction(
	"public",
	z.object({ search: z.string().optional() }),
)(async ({ user, input }) => {
	const researches = await (async () => {
		if (input.search) {
			const embedding = await AIService.createEmbedding({ model: "text-embedding-3-small", text: input.search })

			const researchIds = await ResearchRepo.queryVector(embedding, { topK: 10 })

			const researches = await db.query.Research.findMany({
				where: inArray(Research.id, researchIds),
			})

			return researches.sort((a, b) => researchIds.indexOf(a.id) - researchIds.indexOf(b.id))
		} else {
			return await db.query.Research.findMany({
				where: eq(Research.isComplete, true),
				orderBy: desc(Research.starCount),
				limit: 10,
			})
		}
	})()

	const userToStarredResearches = user.userId
		? await db.query.UserToStarredResearch.findMany({
				where: and(
					eq(UserToStarredResearch.userId, user.userId),
					inArray(
						UserToStarredResearch.researchId,
						researches.map(r => r.id),
					),
				),
			})
		: []

	const queriedUsers = await ClerkService.queryUsers(researches.map(r => r.userId))

	return {
		queriedUsers,
		researches,
		userToStarredResearches,
	}
})
