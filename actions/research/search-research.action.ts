"use server"

import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { and, desc, eq, like } from "drizzle-orm"
import { z } from "zod"

export const searchResearchAction = createAction(
	"public",
	z.object({ search: z.string().optional() }),
)(async ({ input }) => {
	// Use Vector DB
	const researches = input.search
		? await db.query.Research.findMany({
				where: and(eq(Research.isComplete, true), like(Research.name, `%${input.search}%`)),
				orderBy: desc(Research.stars),
				limit: 10,
			})
		: await db.query.Research.findMany({
				where: eq(Research.isComplete, true),
				orderBy: desc(Research.stars),
				limit: 10,
			})

	const userIds = researches.map(r => r.userId)
	const users = await ClerkService.getUsers(userIds)

	return {
		researches,
		users,
	}
})
