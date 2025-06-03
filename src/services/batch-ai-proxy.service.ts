import { CoreMessage, GenerateObjectResult, GenerateTextResult } from "ai"
import { JSONSchema7 } from "json-schema"
import SuperJSON from "superjson"
import { ZodSchema } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { APIKeyT } from "../schemas"

type BatchAIProxyI = {
	provider: string
	modelId: string
	messages: CoreMessage[]
	jsonSchema?: JSONSchema7 | undefined
}

export type BatchCompletionI = Omit<BatchAIProxyI, "jsonSchema">
export type BatchStructuredCompletionI<T> = Omit<BatchAIProxyI, "jsonSchema"> & { schema: ZodSchema<T> }

const config = {
	url: "https://b53qigl5k76lyxhudi6tdr5mli0widrp.lambda-url.us-east-1.on.aws",
}

export class BatchAIProxyService {
	static getAPIKey(input: { provider: string; apiKey: Partial<APIKeyT> }) {
		return (input.apiKey[input.provider.split(".")[0] as keyof APIKeyT] as string) ?? ""
	}

	static async batchCompletion(inputs: BatchCompletionI[], apiKey: Partial<APIKeyT>) {
		const key = this.getAPIKey({ provider: inputs[0].provider, apiKey })

		const result = await fetch(config.url, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": key },
			body: JSON.stringify(inputs),
		})

		if (!result.ok || !result.body) {
			throw new Error(result.statusText)
		}

		const reader = result.body.getReader()
		const decoder = new TextDecoder()
		let chunks = ""
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			chunks += decoder.decode(value, { stream: true })
		}

		chunks += decoder.decode()
		const json = SuperJSON.parse(chunks)

		if (json instanceof Error) {
			throw json
		}

		return json as GenerateTextResult<never, never>[]
	}

	static async batchStructuredCompletion<T>(inputs: Array<BatchStructuredCompletionI<T>>, apiKey: Partial<APIKeyT>) {
		const key = this.getAPIKey({ provider: inputs[0].provider, apiKey })
		const payload: BatchAIProxyI[] = inputs.map(input => ({ ...input, jsonSchema: zodToJsonSchema(input.schema) as JSONSchema7 }))

		const result = await fetch(config.url, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-api-key": key },
			body: JSON.stringify(payload),
		})

		if (!result.ok || !result.body) {
			throw new Error(result.statusText)
		}

		const reader = result.body.getReader()
		const decoder = new TextDecoder()
		let chunks = ""
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			chunks += decoder.decode(value, { stream: true })
		}

		chunks += decoder.decode()
		const json = SuperJSON.parse(chunks)

		if (json instanceof Error) {
			throw json
		}

		return json as GenerateObjectResult<T>[]
	}
}
