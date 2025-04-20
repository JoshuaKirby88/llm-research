import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { CoreMessage, customProvider, embed, generateObject, generateText } from "ai"
import { ZodSchema, z } from "zod"
import { AIModel } from "../features"

type EmbeddingModel = Parameters<(typeof AIService)["models"]["textEmbeddingModel"]>[0]

export class AIService {
	private static openai = createOpenAI()
	private static models = customProvider({
		languageModels: {
			"o4-mini": this.openai("o4-mini"),
			"o3-mini": this.openai("o3-mini"),
			o3: this.openai("o3"),
			"GPT-4.1": this.openai("gpt-4.1"),
			"Gemini 2.5 Pro": google("gemini-2.5-pro-exp-03-25"),
			"Claude 3.7 Sonnet": anthropic("claude-3-7-sonnet-20250219"),
		} satisfies Record<AIModel, any>,
		textEmbeddingModels: {
			"text-embedding-3-small": this.openai.embedding("text-embedding-3-small", { dimensions: 1536 }),
		},
	})

	static async getCompletion(input: { model: AIModel; messages: CoreMessage[] }) {
		const result = await generateText({
			model: this.models.languageModel(input.model),
			messages: input.messages,
		})

		return {
			completion: result.text,
			tokens: result.usage,
		}
	}

	static async getStructuredCompletion<T extends ZodSchema>(input: { model: AIModel; schema: T; messages: CoreMessage[] }) {
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

	static async createEmbedding(input: { model: EmbeddingModel; text: string }) {
		const result = await embed({
			model: this.models.textEmbeddingModel(input.model),
			value: input.text,
		})

		return result.embedding
	}
}
