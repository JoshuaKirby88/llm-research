"use server"
import { generateValuePrompts } from "@/src/prompts/create-research/generate-value.prompts"
import { createResearchISchema, variableSchema } from "@/src/schemas"
import { MyAIService } from "@/src/services/ai.service"
import { createAction } from "@/utils/actions/create-action"
import { z } from "zod"

const schema = z.object({
	formValues: createResearchISchema.lax,
	prompt: z.string(),
	variable: variableSchema,
	blockingIndex: z.number().optional(),
	count: z.number(),
	currentValues: z.string().array().optional(),
})

export const generateValueAction = createAction(
	"signedIn",
	schema,
)(async ({ input }) => {
	const { completion } = await MyAIService.getStructuredCompletion({
		model: "Gemini 2.5 Flash",
		messages: [
			{ role: "system", content: generateValuePrompts.system },
			{ role: "user", content: generateValuePrompts.user(input) },
		],
		schema: z.object({ values: z.string().array().length(input.count) }),
	})

	return {
		values: completion.values,
	}
})
