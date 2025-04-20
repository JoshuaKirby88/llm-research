import { AIFeature, AIProvider } from "../features"
import { APIKeyT, MaskedAPIKeyT, PartialAPIKeyT } from "../schemas"
import { CryptoService } from "../services"

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
		const filteredKeys = AIFeature.providers.filter(aiProvider => aiProvider in input)

		const encryptedAPIKey = filteredKeys.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.encrypt(input[curr] as string) : null,
			}),
			{} as PartialAPIKeyT,
		)

		return encryptedAPIKey
	}

	static decrypt(input: Pick<APIKeyT, AIProvider>) {
		const filteredKeys = AIFeature.providers.filter(aiProvider => aiProvider in input)

		const decryptedAPIKey = filteredKeys.reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr] ? CryptoService.decrypt(input[curr]) : null,
			}),
			{} as Pick<APIKeyT, AIProvider>,
		)

		return decryptedAPIKey
	}

	static mask(input: Pick<APIKeyT, AIProvider>) {
		return Object.keys(input).reduce(
			(acc, curr) => ({
				...acc,
				[curr]: input[curr as AIProvider] ? this.maskedValue.repeat(input[curr as AIProvider]!.length) : "",
			}),
			{} as MaskedAPIKeyT,
		)
	}

	static keyExists(maskedAPIKey: MaskedAPIKeyT | null): maskedAPIKey is MaskedAPIKeyT {
		return !!maskedAPIKey && !!AIFeature.providers.find(provider => maskedAPIKey[provider])
	}
}
