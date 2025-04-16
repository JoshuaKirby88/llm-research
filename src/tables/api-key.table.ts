import { APIKeyT, MaskedAPIKeyT, PartialAPIKeyT } from "../schemas"
import { CryptoService } from "../services/crypto.service"

export type APIKeyKey = (typeof APIKeyTable.keys)[number]

export class APIKeyTable {
	static keys = ["openai", "google", "anthropic"] as const
	static maskedValue = "x"

	static filter(defaultAPIKey: MaskedAPIKeyT | null, apiKey: PartialAPIKeyT) {
		return Object.fromEntries(
			Object.entries(apiKey).filter(([key, value]) => {
				const isMasked = value?.trim() && !value.replaceAll("x", "").trim()
				const isChanged = value?.trim() !== defaultAPIKey?.[key as APIKeyKey]
				return isChanged && !isMasked
			}),
		) as PartialAPIKeyT
	}

	static encrypt(input: PartialAPIKeyT) {
		const filteredKeys = this.keys.filter(key => key in input)

		const encryptedAPIKey = filteredKeys.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.encrypt(input[curr] as string) : null,
			}),
			{} as PartialAPIKeyT,
		)

		return encryptedAPIKey
	}

	static decrypt(input: Pick<APIKeyT, APIKeyKey>) {
		const filteredKeys = this.keys.filter(key => key in input)

		const decryptedAPIKey = filteredKeys.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.decrypt(input[curr]) : null,
			}),
			{} as Pick<APIKeyT, APIKeyKey>,
		)

		return decryptedAPIKey
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
