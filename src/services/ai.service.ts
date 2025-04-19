import { createOpenAI } from "@ai-sdk/openai"
import { customProvider, embed } from "ai"

type LanguageModel = Parameters<(typeof AIService)["models"]["languageModel"]>[0]
type EmbeddingModel = Parameters<(typeof AIService)["models"]["textEmbeddingModel"]>[0]

export class AIService {
	private static openai = createOpenAI()
	private static models = customProvider({
		languageModels: {},
		textEmbeddingModels: {
			"text-embedding-3-small": this.openai.embedding("text-embedding-3-small", { dimensions: 1536 }),
		},
	})

	static async createEmbedding(input: { model: EmbeddingModel; text: string }) {
		const result = await embed({
			model: this.models.textEmbeddingModel(input.model),
			value: input.text,
		})

		return result.embedding
	}
}
