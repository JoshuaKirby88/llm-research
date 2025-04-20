"use server"

import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { AIService } from "@/src/services/ai.service"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

export const searchResearchAction = createAction(
	"public",
	z.object({ search: z.string().optional() }),
)(async ({ input }) => {
	const researches = await (async () => {
		if (input.search) {
			const embedding = await AIService.createEmbedding({ model: "text-embedding-3-small", text: input.search })

			return await ResearchRepo.queryFromVector(embedding, { topK: 10 })
		} else {
			return await db.query.Research.findMany({
				where: eq(Research.isComplete, true),
				orderBy: desc(Research.stars),
				limit: 10,
			})
		}
	})()

	const userIds = researches.map(r => r.userId)
	const users = await ClerkService.getUsers(userIds)

	return {
		researches,
		users,
	}
})
