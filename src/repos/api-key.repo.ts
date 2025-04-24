import { db } from "@/drizzle/db"
import { APIKey } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { APIKeyT, InsertAPIKeyT, UpdateAPIKeyT } from "../schemas"

export class APIKeyRepo {
	static async insert(input: InsertAPIKeyT) {
		const [newKey] = await db.insert(APIKey).values(input).returning()
		return newKey
	}

	static async query(userId: APIKeyT["userId"]) {
		const apiKey = await db.query.APIKey.findFirst({
			where: eq(APIKey.userId, userId),
		})

		return apiKey
	}

	static async update(userId: APIKeyT["userId"], input: Omit<UpdateAPIKeyT, "userId">) {
		const insertValues: InsertAPIKeyT = { userId, ...input }
		const updateValues: Omit<UpdateAPIKeyT, "userId"> = input

		const [updatedKey] = await db
			.insert(APIKey)
			.values(insertValues)
			.onConflictDoUpdate({
				target: APIKey.userId,
				set: updateValues,
			})
			.returning()

		return updatedKey
	}

	static async delete(userId: APIKeyT["userId"]) {
		await db.delete(APIKey).where(eq(APIKey.userId, userId))
	}
}
