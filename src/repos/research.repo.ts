import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { InsertResearchT, ResearchT, UpdateResearchT } from "../schemas"

export class ResearchRepo {
	static async insert(input: InsertResearchT, tx?: TX) {
		const [newResearch] = await (tx ?? db).insert(Research).values(input).returning()

		return newResearch
	}

	static async update(id: ResearchT["id"], input: Omit<UpdateResearchT, "id">, tx?: TX) {
		const [updatedResearch] = await (tx ?? db).update(Research).set(input).where(eq(Research.id, id)).returning()

		return updatedResearch
	}

	static async delete(id: ResearchT["id"], tx?: TX) {
		await (tx ?? db).delete(Research).where(eq(Research.id, id))
	}
}
