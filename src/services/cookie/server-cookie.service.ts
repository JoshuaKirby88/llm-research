import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export class ServerCookieService {
	static async set(...args: Parameters<ResponseCookies["set"]>) {
		const jar = await cookies()
		jar.set(...args)
	}

	static async get(name: string) {
		const jar = await cookies()
		return jar.get(name)?.value
	}

	static async delete(name: string) {
		const jar = await cookies()
		jar.delete(name)
	}
}
