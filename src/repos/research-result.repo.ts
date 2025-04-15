import { db } from "@/drizzle/db"
import { ResearchResult } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertResearchResultT, ResearchResultT, UpdateResearchResultT } from "../schemas"

export class ResearchResultRepo {
	static async insert(input: InsertResearchResultT, tx?: TX) {
		const [newResearchResult] = await (tx ?? db).insert(ResearchResult).values(input).returning()
		return newResearchResult
	}

	static async update(id: ResearchResultT["id"], input: Omit<UpdateResearchResultT, "id">, tx?: TX) {
		const [updatedResearchResult] = await (tx ?? db).update(ResearchResult).set(input).where(eq(ResearchResult.id, id)).returning()
		return updatedResearchResult
	}

	static async delete(id: ResearchResultT["id"], tx?: TX) {
		await (tx ?? db).delete(ResearchResult).where(eq(ResearchResult.id, id))
	}
}
