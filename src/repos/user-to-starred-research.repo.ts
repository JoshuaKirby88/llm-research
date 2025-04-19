import { db } from "@/drizzle/db"
import { UserToStarredResearch } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { and, eq } from "drizzle-orm"
import { InsertUserToStarredResearchT, UserToStarredResearchT } from "../schemas"

export class UserToStarredResearchRepo {
	static async insert(input: InsertUserToStarredResearchT, tx?: TX) {
		const [newUserToStarredResearch] = await (tx ?? db).insert(UserToStarredResearch).values(input).returning()
		return newUserToStarredResearch
	}

	static async delete(input: Pick<UserToStarredResearchT, "userId" | "researchId">, tx?: TX) {
		await (tx ?? db).delete(UserToStarredResearch).where(and(eq(UserToStarredResearch.userId, input.userId), eq(UserToStarredResearch.researchId, input.researchId)))
	}
}
