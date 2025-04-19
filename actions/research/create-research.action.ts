"use server"

import { transaction } from "@/drizzle/transaction"
import { BlockingValueRepo, BlockingVariableRepo, EvalPromptRepo, IndependentValueRepo, IndependentVariableRepo, MessagePromptRepo, ResearchRepo, ResultEnumRepo } from "@/src/repos"
import { InsertBlockingValueT, InsertBlockingVariableT, InsertIndependentValueT, InsertMessagePromptT, InsertResultEnumT, createResearchSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const createResearchAction = createAction(
	"signedIn",
	createResearchSchema,
)(async ({ user, input }) => {
	return await transaction(async tx => {
		const newResearch = await ResearchRepo.insert({ userId: user.userId, name: input.research.name }, tx)

		const newIndependentVariable = await IndependentVariableRepo.insert({ researchId: newResearch.id, name: input.independentVariable.name }, tx)
		const independentValuesToInsert: InsertIndependentValueT[] = input.independentVariable.values.map(value => ({
			independentVariableId: newIndependentVariable.id,
			value,
		}))
		const newIndependentValues = await IndependentValueRepo.insertMany(independentValuesToInsert, tx)

		const blockingVariablesToInsert: InsertBlockingVariableT[] = input.blockingVariables.map(blockingVariable => ({
			researchId: newResearch.id,
			name: blockingVariable.name,
		}))
		const newBlockingVariables = await BlockingVariableRepo.insertMany(blockingVariablesToInsert, tx)
		const blockingValesToInsert: InsertBlockingValueT[] = input.blockingVariables.flatMap((blockingVariable, i) =>
			blockingVariable.values.map(value => ({
				blockingVariableId: newBlockingVariables[i].id,
				value,
			})),
		)
		const newBlockingValues = await BlockingValueRepo.insertMany(blockingValesToInsert, tx)

		const messagePromptsToInsert: InsertMessagePromptT[] = [
			{ researchId: newResearch.id, role: "system", text: input.systemMessagePrompt.text },
			{ researchId: newResearch.id, role: "user", text: input.userMessagePrompt.text },
		]
		const newMessagePrompts = await MessagePromptRepo.insertMany(messagePromptsToInsert, tx)

		const newEvalPrompt = await EvalPromptRepo.insert({ researchId: newResearch.id, text: input.evalPrompt.text }, tx)

		const resultEnumsToInsert: InsertResultEnumT[] = input.resultEnums.map(value => ({ researchId: newResearch.id, value }))
		const newResultEnums = await ResultEnumRepo.insertMany(resultEnumsToInsert, tx)

		redirect(`/research/${newResearch.id}`)
	})
})
