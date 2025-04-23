import { APIKeyError } from "../entities/errors"
import { AIFeature, AIProvider } from "../features"
import { APIKeyT, MaskedAPIKeyT, PartialAPIKeyT } from "../schemas"
import { CryptoService } from "../services/crypto.service"

export class APIKeyTable {
	static maskedValue = "x"

	static filter(defaultAPIKey: MaskedAPIKeyT | null, apiKey: PartialAPIKeyT) {
		return Object.fromEntries(
			Object.entries(apiKey).filter(([key, value]) => {
				const isMasked = value?.trim() && !value.replaceAll("x", "").trim()
				const isChanged = value?.trim() !== defaultAPIKey?.[key as AIProvider]
				return isChanged && !isMasked
			}),
		) as PartialAPIKeyT
	}

	static encrypt(input: PartialAPIKeyT) {
		const filteredProviders = AIFeature.providers.filter(aiProvider => aiProvider in input)

		const encryptedAPIKey = filteredProviders.reduce<PartialAPIKeyT>(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.encrypt(input[curr] as string) : null,
			}),
			{},
		)

		return encryptedAPIKey
	}

	static decrypt(input: APIKeyT) {
		const decryptedAPIKey = AIFeature.providers.reduce<APIKeyT>(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.decrypt(input[curr]) : null,
			}),
			{ ...input },
		)

		return decryptedAPIKey
	}

	static mask(input: APIKeyT) {
		return AIFeature.providers.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? this.maskedValue.repeat(input[curr].length) : "",
			}),
			{ ...input } as MaskedAPIKeyT,
		)
	}

	static keyExists<T extends APIKeyT | MaskedAPIKeyT>(apiKey: T | null): apiKey is T {
		return !!apiKey && !!AIFeature.providers.find(provider => apiKey[provider])
	}

	static validate(apiKey: APIKeyT | undefined) {
		if (!apiKey || !this.keyExists(apiKey)) {
			throw new APIKeyError("noAPIKey")
		}

		const decryptedAPIKey = this.decrypt(apiKey)

		return decryptedAPIKey
	}
}
