import { BatchAII, BatchAIO } from "@/app/api/batch-ai/route"
import { env } from "@/utils/env"
import { CoreMessage } from "ai"
import { AIModel } from "../features"
import { AIServiceSchema, AIServiceSchemaKey, APIKeyT } from "../schemas"
import { AIServiceInstance } from "./ai.service"

export class BatchAIService {
	static async batchCompletion(inputs: { model: AIModel; messages: CoreMessage[] }[], apiKey: Partial<APIKeyT>) {
		const payload: BatchAII = { apiKey, fn: "completion", items: inputs }

		const result = await fetch(`${env.NEXT_PUBLIC_URL}/api/batch-ai`, {
			method: "POST",
			body: JSON.stringify(payload),
		})

		const json: BatchAIO = await result.json()

		if ("error" in json) {
			throw new Error(json.error)
		}

		return json as Return<AIServiceInstance["getCompletion"]>[]
	}

	static async batchStructuredCompletion<T extends AIServiceSchema[AIServiceSchemaKey]["json"]>(inputs: { model: AIModel; messages: CoreMessage[]; schema: T }[], apiKey: Partial<APIKeyT>) {
		const payload: BatchAII = { apiKey, fn: "structuredCompletion", items: inputs }

		const result = await fetch(`${env.NEXT_PUBLIC_URL}/api/batch-ai`, {
			method: "POST",
			body: JSON.stringify(payload),
		})

		const json: BatchAIO = await result.json()

		if ("error" in json) {
			throw new Error(json.error)
		}

		return json as Return<AIServiceInstance["getStructuredCompletion"]>[]
	}
}
