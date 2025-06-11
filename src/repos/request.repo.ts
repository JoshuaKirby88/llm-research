import { db } from "@/drizzle/db"
import { Request } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { InsertRequestT, RequestT, UpdateRequestT } from "../schemas"

export class RequestRepo {
	static async insert(input: InsertRequestT) {
		const [newRequest] = await db.insert(Request).values(input).returning()
		return newRequest
	}

	static async query(id: RequestT["id"]) {
		const request = await db.query.Request.findFirst({
			where: eq(Request.id, id),
		})

		return request
	}

	static async update(id: RequestT["id"], input: Omit<UpdateRequestT, "id">) {
		const [updatedRequest] = await db.update(Request).set(input).where(eq(Request.id, id)).returning()

		return updatedRequest
	}

	static async delete(id: RequestT["id"]) {
		await db.delete(Request).where(eq(Request.id, id))
	}
}
