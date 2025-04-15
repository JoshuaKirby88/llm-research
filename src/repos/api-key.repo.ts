import { db } from "@/drizzle/db"
import { APIKey } from "@/drizzle/schema"
import { TX } from "@/drizzle/transaction"
import { eq } from "drizzle-orm"
import { APIKeyT, InsertAPIKeyT, UpdateAPIKeyT } from "../schemas"

export class APIKeyRepo {
	static async insert(input: InsertAPIKeyT, tx?: TX) {
		const [newKey] = await (tx ?? db).insert(APIKey).values(input).returning()
		return newKey
	}

	static async update(userId: APIKeyT["userId"], input: Omit<UpdateAPIKeyT, "userId">, tx?: TX) {
		const insertValues: InsertAPIKeyT = { userId, ...input }
		const updateValues: Omit<UpdateAPIKeyT, "userId"> = input

		const [updatedKey] = await (tx ?? db)
			.insert(APIKey)
			.values(insertValues)
			.onConflictDoUpdate({
				target: APIKey.userId,
				set: updateValues,
			})
			.returning()

		return updatedKey
	}

	static async delete(userId: APIKeyT["userId"], tx?: TX) {
		await (tx ?? db).delete(APIKey).where(eq(APIKey.userId, userId))
	}
}
