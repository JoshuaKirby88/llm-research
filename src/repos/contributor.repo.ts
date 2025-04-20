import { db } from "@/drizzle/db"
import { Contributor } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { InsertContributorT } from "../schemas"
import { DrizzleService } from "../services"

export class ContributorRepo {
	static async incrementCount(input: InsertContributorT, tx?: TX) {
		const insertValues = input
		const updateValues = { count: DrizzleService.increment(Contributor.count, input.count) }

		const [contributor] = await (tx ?? db)
			.insert(Contributor)
			.values(insertValues)
			.returning()
			// Does this work for non primary key columns...?
			.onConflictDoUpdate({ target: [Contributor.userId, Contributor.researchId], set: updateValues })

		return contributor
	}
}
