import { clerkClient } from "@clerk/nextjs/server"

const client = await clerkClient()

export class ClerkService {
	static async getUser(userId: string) {
		return await client.users.getUser(userId)
	}

	static async getUsers(userIds: string[]) {
		const uniqueUserIds = Array.from(new Set(userIds))
		const result = await client.users.getUserList({ userId: uniqueUserIds })
		return result.data.sort((a, b) => uniqueUserIds.indexOf(a.id) - uniqueUserIds.indexOf(b.id))
	}

	static async deleteUser(userId: string) {
		await client.users.deleteUser(userId)
	}
}
