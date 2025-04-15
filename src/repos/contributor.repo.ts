import { db } from "@/drizzle/db"
import { Contributor } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { ContributorT, InsertContributorT, UpdateContributorT } from "../schemas"

export class ContributorRepo {
	static async insert(input: InsertContributorT, tx?: TX) {
		const [newContributor] = await (tx ?? db).insert(Contributor).values(input).returning()

		return newContributor
	}

	static async update(id: ContributorT["id"], input: Omit<UpdateContributorT, "id">, tx?: TX) {
		const [updatedContributor] = await (tx ?? db).update(Contributor).set(input).where(eq(Contributor.id, id)).returning()

		return updatedContributor
	}

	static async delete(id: ContributorT["id"], tx?: TX) {
		await (tx ?? db).delete(Contributor).where(eq(Contributor.id, id))
	}
}
