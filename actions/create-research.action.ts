"use server"

import { CreateResearchI } from "@/app/research/_components/create-research-form"
import { transaction } from "@/drizzle/transaction"
import { BlockingValueRepo, BlockingVariableRepo, EvalPromptRepo, IndependentValueRepo, IndependentVariableRepo, MessagePromptRepo, ResearchRepo, ResultEnumRepo } from "@/src/repos"
import { InsertBlockingValueT, InsertBlockingVariableT, InsertIndependentValueT, InsertMessagePromptT, InsertResultEnumT } from "@/src/schemas"
import { auth } from "@clerk/nextjs/server"

export const startResearchAction = async (input: CreateResearchI) => {
	const { userId, redirectToSignIn } = await auth()

	if (!userId) {
		return redirectToSignIn()
	}

	return await transaction(async tx => {
		const newResearch = await ResearchRepo.insert({ userId, name: input.research.name }, tx)

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
	})
}
