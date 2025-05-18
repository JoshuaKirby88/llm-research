import { AIModel } from "@/src/features"
import { APIKeyT } from "@/src/schemas"
import { AIServiceSchema, AIServiceSchemaKey, AIServiceSchemas } from "@/src/schemas/services/ai-service.schema"
import { AIServiceInstance, AIService as MyAIService } from "@/src/services/ai.service"
import { chunk } from "@/utils/chunk"
import { CoreMessage } from "ai"
import { NextRequest, NextResponse } from "next/server"

type Input = (
	| { fn: "structuredCompletion"; input: { model: AIModel; schema: AIServiceSchema[AIServiceSchemaKey]["json"]; messages: CoreMessage[] }[] }
	| { fn: "completion"; input: { model: AIModel; messages: CoreMessage[] }[] }
) & {
	apiKey?: Partial<APIKeyT>
}
export type BatchAII = Input

const config = {
	chunkSize: 50,
}

export const POST = async (request: NextRequest) => {
	const { fn, input, apiKey }: Input = await request.json()

	const AIService = apiKey ? new AIServiceInstance(apiKey) : MyAIService

	if (fn === "structuredCompletion") {
		const chunkedInput = chunk(input, { chunkSize: config.chunkSize, maxChunks: config.chunkSize })

		if (chunkedInput.length >= 2) {
			const response = await Promise.all(chunkedInput.map(chunk => AIService.batchStructuredCompletion(chunk)))
			const flat = response.flat()
			return NextResponse.json(flat)
		} else {
			const result = await Promise.all(
				input.map(safePayload => {
					const payload = { ...safePayload, schema: AIServiceSchemas[safePayload.schema.key](safePayload.schema.arg as any).schema }
					return AIService.getStructuredCompletion(payload)
				}),
			)
			return NextResponse.json(result)
		}
	} else if (fn === "completion") {
		const chunkedInput = chunk(input, { chunkSize: config.chunkSize, maxChunks: config.chunkSize })

		if (chunkedInput.length >= 2) {
			const response = await Promise.all(chunkedInput.map(chunk => AIService.batchCompletion(chunk)))
			const flat = response.flat()
			return NextResponse.json(flat)
		} else {
			const result = await Promise.all(input.map(payload => AIService.getCompletion(payload)))
			return NextResponse.json(result)
		}
	}
}
