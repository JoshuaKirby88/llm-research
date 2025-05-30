"use server"

import { generateValuePrompts } from "@/src/prompts/create-research/generate-value.prompts"
import { createResearchISchema, variableSchema } from "@/src/schemas"
import { AIService } from "@/src/services/ai.service"
import { createAction } from "@/utils/actions/create-action"
import { z } from "zod"

const schema = z.object({
	formValues: createResearchISchema,
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
	const { completion } = await AIService.getStructuredCompletion({
		model: "GPT-4o mini",
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
