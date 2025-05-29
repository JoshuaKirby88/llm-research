import { db } from "@/drizzle/db"
import { Account } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { AccountT, InsertAccountT, UpdateAccountT } from "../schemas"

export class AccountRepo {
	static async insert(input: InsertAccountT) {
		const [newAccount] = await db.insert(Account).values(input).returning()
		return newAccount
	}

	static async query(userId: AccountT["userId"]) {
		const account = await db.query.Account.findFirst({
			where: eq(Account.userId, userId),
		})

		return account
	}

	static async update(userId: AccountT["userId"], input: Omit<UpdateAccountT, "userId">) {
		const [updatedAccount] = await db.update(Account).set(input).where(eq(Account.userId, userId)).returning()

		return updatedAccount
	}

	static async delete(userId: AccountT["userId"]) {
		await db.delete(Account).where(eq(Account.userId, userId))
	}
}
