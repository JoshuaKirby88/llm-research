"use server"

import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ResearchT } from "@/src/schemas"
import { eq } from "drizzle-orm"

export const searchResearchAction = async (input: { search?: string | string[] }) => {
	if (input.search) {
		const researches = await db.query.Research.findMany({
			where: eq(Research.isCompleted, true),
		})

		return researches
	} else {
		return [
			{ id: 1, name: "Research on Prompt Engineering" },
			{ id: 2, name: "LLM Behaviour Study" },
			{ id: 3, name: "User Prompt Analysis" },
		] as ResearchT[]
	}
}
