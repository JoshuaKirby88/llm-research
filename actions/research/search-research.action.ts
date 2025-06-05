"use server"

import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ResearchVectorRepo } from "@/src/repos/research-vector.repo"
import { AIService } from "@/src/services/ai.service"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { destructureArray } from "@/utils/destructure-array"
import { desc, eq, inArray } from "drizzle-orm"
import { z } from "zod"

export const searchResearchAction = createAction(
	"public",
	z.object({ search: z.string().optional() }),
)(async ({ user, input }) => {
	const result = await (async () => {
		if (input.search) {
			const embedding = await AIService.createEmbedding({ model: "text-embedding-3-small", text: input.search })

			const researchIds = await ResearchVectorRepo.query(embedding, { topK: 10, minScore: 0.3 })

			const researches = await db.query.Research.findMany({
				where: inArray(Research.id, researchIds),
				with: {
					userToStarredResearches: user.userId ? { where: eq(UserToStarredResearch.userId, user.userId) } : { limit: 0 },
				},
			})

			return researches.sort((a, b) => researchIds.indexOf(a.id) - researchIds.indexOf(b.id))
		} else {
			return await db.query.Research.findMany({
				where: ResearchRepo.getPublicWhere({ user: null }),
				with: {
					userToStarredResearches: user.userId ? { where: eq(UserToStarredResearch.userId, user.userId) } : { limit: 0 },
				},
				orderBy: desc(Research.starCount),
				limit: 10,
			})
		}
	})()

	const queriedUsers = await ClerkService.queryUsers(result.map(r => r.userId))

	const [researches, { userToStarredResearches }] = destructureArray(result, { userToStarredResearches: true })

	return {
		user,
		queriedUsers,
		researches,
		userToStarredResearches,
	}
})
