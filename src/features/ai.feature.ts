import { MaskedAPIKeyT } from "../schemas"

export type AIProvider = keyof typeof AIFeature.providerMap
export type AIModel = (typeof AIFeature.providerMap)[keyof typeof AIFeature.providerMap]["models"][number]
export type AIModelArr = [AIModel, ...AIModel[]]

export class AIFeature {
	static providerMap = {
		openai: {
			title: "OpenAI",
			models: ["o4-mini", "o3-mini", "o3", "GPT-4.1", "GPT-4.1 Mini", "GPT-4.1 Nano"],
		},
		google: {
			title: "Google",
			models: ["Gemini 2.5 Pro"],
		},
		anthropic: {
			title: "Anthropic",
			models: ["Claude 3.7 Sonnet"],
		},
	} as const
	static providers = Object.keys(this.providerMap) as AIProvider[]
	static models = Object.values(this.providerMap).flatMap(provider => provider.models) as AIModel[]
	static promptModel: AIModel = "GPT-4.1 Nano"
	static apiKeyErrors = ["api key", "x-api-key"]

	static modelToProvider(aiModel: AIModel) {
		return this.providers.find(aiProvider => this.providerMap[aiProvider].models.includes(aiModel as never)) as AIProvider
	}

	static providersByMaskedAPIKey(maskedAPIKey: MaskedAPIKeyT) {
		return this.providers.filter(provider => maskedAPIKey[provider])
	}
}
