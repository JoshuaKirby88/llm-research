import { User, clerkClient } from "@clerk/nextjs/server"
import { AuthProcedureO } from "./auth-procedure.service"

export type ClerkPublicUser = AuthProcedureO<"public">
export type ClerkUser = AuthProcedureO<"signedIn">
export type ClerkQueriedUser = User

const client = await clerkClient()

export class ClerkService {
	static async queryUser(userId: string): Promise<ClerkQueriedUser | undefined> {
		const user = await client.users.getUser(userId)
		return user
	}

	static async queryUsers(userIds: string[]) {
		const uniqueUserIds = Array.from(new Set(userIds))
		const result = await client.users.getUserList({ userId: uniqueUserIds })
		return result.data.sort((a, b) => uniqueUserIds.indexOf(a.id) - uniqueUserIds.indexOf(b.id))
	}

	static async deleteUser(userId: string) {
		await client.users.deleteUser(userId)
	}
}
