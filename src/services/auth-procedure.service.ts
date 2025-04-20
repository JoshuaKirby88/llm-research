import { auth } from "@clerk/nextjs/server"
import { ActionError } from "../entities/errors"

export type AuthProcedure = keyof {
	[K in keyof typeof AuthProcedureService as (typeof AuthProcedureService)[K] extends (...args: any[]) => Promise<any> ? K : never]: any
}

export type AuthProcedureO<T extends AuthProcedure> = Awaited<ReturnType<(typeof AuthProcedureService)[T]>>

export class AuthProcedureService {
	static async public() {
		return await auth()
	}

	static async signedIn() {
		const user = await this.public()

		if (!user.userId) {
			throw new ActionError("You must be signed in.")
		}

		return user
	}
}
