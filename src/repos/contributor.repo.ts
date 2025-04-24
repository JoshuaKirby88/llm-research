import { db } from "@/drizzle/db"
import { Contributor } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { ContributorT, InsertContributorT, UpdateContributorT } from "../schemas"
import { DrizzleService, TableSQLUpdate } from "../services/drizzle.service"

export class ContributorRepo {
	static async incrementCount(input: InsertContributorT) {
		const insertValues = input
		const updateValues = { count: DrizzleService.increment(Contributor.count, input.count) }

		const [contributor] = await db
			.insert(Contributor)
			.values(insertValues)
			.onConflictDoUpdate({ target: [Contributor.userId, Contributor.researchId], set: updateValues })
			.returning()

		return contributor
	}

	static async undoIncrementCount(input: Pick<InsertContributorT, "count">, contributor: Return<typeof this.incrementCount>) {
		// Delete if incrementCount was "insert"
		if (input.count === contributor.count) {
			await this.delete(contributor.id)
		}

		// Decrement if incrementCount was "update"
		else {
			await this.update(contributor.id, { count: DrizzleService.increment(Contributor.count, -input.count) })
		}
	}

	static async update(id: ContributorT["id"], input: Omit<UpdateContributorT, "id"> | TableSQLUpdate<typeof Contributor>) {
		const [updatedContributor] = await db.update(Contributor).set(input).where(eq(Contributor.id, id)).returning()

		return updatedContributor
	}

	static async delete(id: ContributorT["id"]) {
		await db.delete(Contributor).where(eq(Contributor.id, id))
	}
}
