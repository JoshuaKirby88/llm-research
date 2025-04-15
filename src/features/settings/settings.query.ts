import { db } from "@/drizzle/db"
import { APIKey } from "@/drizzle/schema"
import { APIKeyT } from "@/src/schemas"
import { eq } from "drizzle-orm"

export class SettingsQuery {
	static async execute(input: Pick<APIKeyT, "userId">) {
		const key = await db.query.APIKey.findFirst({
			where: eq(APIKey.userId, input.userId),
		})

		return key
	}
}
