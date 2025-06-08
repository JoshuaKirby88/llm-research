import { AIModel } from "@/src/features"
import { AIServiceSchema, AIServiceSchemaKey, APIKeyT, aiServiceSchemas } from "@/src/schemas"
import { AIServiceI } from "@/src/services/ai.service"
import { BatchAIService } from "@/src/services/batch-ai.service"
import { chunk } from "@/utils/chunk"
import { pick } from "@/utils/pick"
import { CoreMessage } from "ai"
import { NextRequest, NextResponse } from "next/server"

export type BatchAII = {
	apiKey: Partial<APIKeyT>
} & (
	| {
			fn: "completion"
			items: {
				model: AIModel
				messages: CoreMessage[]
			}[]
	  }
	| {
			fn: "structuredCompletion"
			items: {
				model: AIModel
				messages: CoreMessage[]
				schema: AIServiceSchema[AIServiceSchemaKey]["json"]
			}[]
	  }
)

export type BatchAIO = Pretty<{ error: string } | Return<AIServiceI["getCompletion" | "getStructuredCompletion"]>[]>

const config = {
	chunkSize: 50,
}

export const POST = async (request: NextRequest) => {
	try {
		const input: BatchAII = await request.json()
		const AIService = new AIServiceI(input.apiKey)

		if (input.fn === "completion") {
			const chunkedInput = chunk(input.items, { chunkSize: config.chunkSize, maxChunks: config.chunkSize })

			if (chunkedInput.length >= 2) {
				const result = await Promise.all(chunkedInput.map(chunk => BatchAIService.batchCompletion(chunk, input.apiKey)))
				return NextResponse.json(result.flat())
			} else {
				const result = await Promise.all(chunkedInput[0].map(safePayload => AIService.getCompletion(safePayload)))
				return NextResponse.json(result)
			}
		} else {
			const chunkedInput = chunk(input.items, { chunkSize: config.chunkSize, maxChunks: config.chunkSize })

			if (chunkedInput.length >= 2) {
				const result = await Promise.all(chunkedInput.map(chunk => BatchAIService.batchStructuredCompletion(chunk, input.apiKey)))
				return NextResponse.json(result.flat())
			} else {
				const result = await Promise.all(
					chunkedInput[0].map(safePayload => {
						const payload = { ...pick(safePayload, ["model", "messages"]), schema: aiServiceSchemas[safePayload.schema.key](safePayload.schema.arg as any).schema }
						return AIService.getStructuredCompletion(payload)
					}),
				)
				return NextResponse.json(result)
			}
		}
	} catch (error: any) {
		return NextResponse.json({ error: String(error.message) })
	}
}
