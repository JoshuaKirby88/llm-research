import { z } from "zod"
import { blockingValueSchema } from "../db/blocking-value.schema"
import { blockingVariableSchema } from "../db/blocking-variable.schema"
import { dependentValueSchema } from "../db/dependent-value.schema"
import { evalPromptSchema } from "../db/eval-prompt.schema"
import { independentValueSchema } from "../db/independent-value.schema"
import { independentVariableSchema } from "../db/independent-variable.schema"
import { messagePromptSchema } from "../db/message-prompt.schema"
import { researchSchema } from "../db/research.schema"

export const createResearchSchema = z.object({
	research: researchSchema.pick({ name: true }),
	independentVariable: independentVariableSchema.pick({ name: true }).extend({ values: independentValueSchema.shape.value.array() }),
	blockingVariables: blockingVariableSchema.pick({ name: true }).extend({ values: blockingValueSchema.shape.value.array() }).array(),
	systemMessagePrompt: messagePromptSchema.pick({ text: true }),
	userMessagePrompt: messagePromptSchema.pick({ text: true }),
	evalPrompt: evalPromptSchema.pick({ text: true }),
	dependentValues: dependentValueSchema.shape.value.array(),
})

export type CreateResearch = z.infer<typeof createResearchSchema>
