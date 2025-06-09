import { stripZodMinMax } from "@/utils/strip-zod-min-max"
import { z } from "zod"
import { blockingValueSchema } from "../db/blocking-value.schema"
import { blockingVariableSchema } from "../db/blocking-variable.schema"
import { dependentValueSchema } from "../db/dependent-value.schema"
import { evalPromptSchema } from "../db/eval-prompt.schema"
import { independentValueSchema } from "../db/independent-value.schema"
import { independentVariableSchema } from "../db/independent-variable.schema"
import { messageTemplateSchema } from "../db/message-template.schema"
import { researchSchema } from "../db/research.schema"

const strictSchema = z.object({
	research: researchSchema.pick({ name: true }),
	independentVariable: independentVariableSchema.pick({ name: true }).extend({ values: independentValueSchema.shape.value.array().min(1) }),
	blockingVariables: blockingVariableSchema
		.pick({ name: true })
		.extend({ values: blockingValueSchema.shape.value.array().min(1) })
		.array()
		.min(1),
	messageTemplates: messageTemplateSchema.pick({ role: true, text: true, isPrompt: true }).array().min(1),
	evalPrompt: evalPromptSchema.pick({ text: true }),
	dependentValues: dependentValueSchema.shape.value.array().min(1),
})

export const createResearchISchema = {
	strict: strictSchema,
	lax: stripZodMinMax(strictSchema),
}

export type CreateResearchI = z.infer<typeof createResearchISchema.strict>
