import { env } from "@/utils/env"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { CoreMessage, LoadAPIKeyError, customProvider, embed, generateObject, generateText } from "ai"
import { ZodSchema, z } from "zod"
import { APIKeyError } from "../entities/errors"
import { AIFeature, AIModel } from "../features"
import { APIKeyT } from "../schemas"

type EmbeddingModel = Parameters<(typeof AIServiceInstance)["prototype"]["models"]["textEmbeddingModel"]>[0]

export class AIServiceInstance {
	private models

	constructor(apiKey?: Partial<APIKeyT>) {
		const openai = createOpenAI({ apiKey: apiKey?.openai ?? "" })
		const google = createGoogleGenerativeAI({ apiKey: apiKey?.google ?? "" })
		const anthropic = createAnthropic({ apiKey: apiKey?.anthropic ?? "" })

		this.models = customProvider({
			languageModels: {
				"o4-mini": openai("o4-mini"),
				"o3-mini": openai("o3-mini"),
				o3: openai("o3"),
				"GPT-4.1": openai("gpt-4.1"),
				"GPT-4.1 Mini": openai("gpt-4.1-mini"),
				"GPT-4.1 Nano": openai("gpt-4.1-nano"),
				"GPT-4o mini": openai("gpt-4o-mini"),
				"Gemini 2.5 Pro": google("gemini-2.5-pro-exp-03-25"),
				"Gemini 2.5 Flash": google("gemini-2.5-flash-preview-04-17"),
				"Claude 3.7 Sonnet": anthropic("claude-3-7-sonnet-20250219"),
			} satisfies Record<AIModel, any>,
			textEmbeddingModels: {
				"text-embedding-3-small": openai.embedding("text-embedding-3-small", { dimensions: 1536 }),
			},
		})
	}

	private async handleAPIKeyError<T>(promise: Promise<T>, input: { model: AIModel }) {
		try {
			return await promise
		} catch (error: any) {
			if (error instanceof LoadAPIKeyError || AIFeature.apiKeyErrors.some(apiKeyError => error.message.toLowerCase().includes(apiKeyError))) {
				const provider = AIFeature.modelToProvider(input.model)
				throw new APIKeyError(provider)
			}

			throw error
		}
	}

	async getCompletion(input: { model: AIModel; messages: CoreMessage[] }) {
		const promise = generateText({
			model: this.models.languageModel(input.model),
			messages: input.messages,
		})

		const result = await this.handleAPIKeyError(promise, input)

		return {
			completion: result.text,
			tokens: result.usage,
		}
	}

	async getStructuredCompletion<T extends ZodSchema>(input: { model: AIModel; schema: T; messages: CoreMessage[] }) {
		const result = await generateObject({
			model: this.models.languageModel(input.model),
			schema: input.schema,
			messages: input.messages,
		})

		return {
			completion: result.object as z.infer<T>,
			tokens: result.usage,
		}
	}

	async createEmbedding(input: { model: EmbeddingModel; text: string }) {
		const result = await embed({
			model: this.models.textEmbeddingModel(input.model),
			value: input.text,
		})

		return result.embedding
	}
}

export const AIService = new AIServiceInstance({ openai: env.OPENAI_API_KEY })
