import { APIKeyT, MaskedAPIKeyT, UpdateAPIKeyT } from "../schemas"
import { CryptoService } from "../services/crypto.service"

export type APIKeyKey = (typeof APIKeyTable.keys)[number]

export class APIKeyTable {
	static keys = ["openai", "google", "anthropic"] as const
	static maskedValue = "x"

	static encrypt(input: Omit<UpdateAPIKeyT, "userId">) {
		const filteredAPIKey = this.keys.filter(key => key in input)

		const encryptedAPIKey = filteredAPIKey.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: CryptoService.encrypt(input[curr] as string),
			}),
			{} as Omit<UpdateAPIKeyT, "userId">,
		)

		return encryptedAPIKey
	}

	static mask(input: Pick<APIKeyT, APIKeyKey>) {
		return Object.keys(input).reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr as APIKeyKey] ? this.maskedValue.repeat(input[curr as APIKeyKey]!.length) : "",
			}),
			{} as MaskedAPIKeyT,
		)
	}
}
