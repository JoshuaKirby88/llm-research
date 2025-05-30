import { User, clerkClient } from "@clerk/nextjs/server"
import { ClerkMetadata, ClerkQueriedUser } from "../schemas"

const client = await clerkClient()

export class ClerkService {
	private static transformUser(user: User): ClerkQueriedUser {
		const { privateMetadata, publicMetadata, unsafeMetadata, ...toKeep } = user
		return { ...toKeep, fullName: user.fullName, metadata: publicMetadata } as ClerkQueriedUser
	}

	static serializeUser(user: User | ClerkQueriedUser): ClerkQueriedUser {
		return { ...user, fullName: user.fullName } as ClerkQueriedUser
	}

	static async queryUser(userId: string) {
		const user = await client.users.getUser(userId)
		return this.transformUser(user)
	}

	static async queryUsers(userIds: string[], options?: { serialize?: boolean }) {
		const uniqueUserIds = Array.from(new Set(userIds))
		const result = await client.users.getUserList({ userId: uniqueUserIds })
		const sorted = result.data.sort((a, b) => uniqueUserIds.indexOf(a.id) - uniqueUserIds.indexOf(b.id))

		if (options?.serialize) {
			return sorted.map(user => this.serializeUser(this.transformUser(user)))
		} else {
			return sorted.map(user => this.transformUser(user))
		}
	}

	static async updateMetadata(userId: string, input: Partial<ClerkMetadata>) {
		const updatedUser = await client.users.updateUserMetadata(userId, {
			publicMetadata: input,
		})

		return this.transformUser(updatedUser)
	}

	static async deleteUser(userId: string) {
		await client.users.deleteUser(userId)
	}
}
