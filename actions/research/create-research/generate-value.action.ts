"use server"

import { generateValuePrompts } from "@/src/prompts/create-research/generate-value.prompts"
import { createResearchISchema } from "@/src/schemas"
import { variableSchema } from "@/src/schemas/features/variable.schema"
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
)(async ({ user, input }) => {
	const prompts = generateValuePrompts(input)

	const { completion } = await AIService.getStructuredCompletion({
		model: "GPT-4o mini",
		messages: [
			{ role: "system", content: prompts.system },
			{ role: "user", content: prompts.user },
		],
		schema: z.object({ values: z.string().array().length(input.count) }),
	})

	return {
		values: completion.values,
	}
})
