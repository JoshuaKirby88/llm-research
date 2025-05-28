import { User, clerkClient } from "@clerk/nextjs/server"
import { AuthProcedureO } from "./auth-procedure.service"

export type ClerkPublicUser = AuthProcedureO<"public">
export type ClerkUser = AuthProcedureO<"signedIn">
export type ClerkQueriedUser = User

const client = await clerkClient()

export class ClerkService {
	static userFnKeys: (keyof User)[] = ["raw"]

	static async queryUser(userId: string): Promise<ClerkQueriedUser | undefined> {
		const user = await client.users.getUser(userId)
		return user
	}

	static async queryUsers(userIds: string[], options?: { serialize?: boolean }): Promise<ClerkQueriedUser[]> {
		const uniqueUserIds = Array.from(new Set(userIds))
		const result = await client.users.getUserList({ userId: uniqueUserIds })
		const sorted = result.data.sort((a, b) => uniqueUserIds.indexOf(a.id) - uniqueUserIds.indexOf(b.id))

		if (options?.serialize) {
			return sorted.map(user => ({ ...JSON.parse(JSON.stringify(user)), fullName: user.fullName }))
		} else {
			return sorted
		}
	}

	static async deleteUser(userId: string) {
		await client.users.deleteUser(userId)
	}
}
