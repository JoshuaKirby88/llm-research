import { db } from "@/drizzle/db"
import { ResearchResult } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { InsertResearchResultT, ResearchResultT, UpdateResearchResultT } from "../schemas"

export class ResearchResultRepo {
	static async insert(input: InsertResearchResultT) {
		const [newResearchResult] = await db.insert(ResearchResult).values(input).returning()
		return newResearchResult
	}

	static async update(id: ResearchResultT["id"], input: Omit<UpdateResearchResultT, "id">) {
		const [updatedResearchResult] = await db.update(ResearchResult).set(input).where(eq(ResearchResult.id, id)).returning()
		return updatedResearchResult
	}

	static async delete(id: ResearchResultT["id"]) {
		await db.delete(ResearchResult).where(eq(ResearchResult.id, id))
	}
}
