"use server"

import { transaction } from "@/drizzle/transaction"
import { SlashEditorFeature } from "@/src/features"
import { BlockingValueRepo, BlockingVariableRepo, DependentValueRepo, EvalPromptRepo, IndependentValueRepo, IndependentVariableRepo, MessagePromptRepo, ResearchRepo } from "@/src/repos"
import { InsertBlockingValueT, InsertBlockingVariableT, InsertDependentValueT, InsertIndependentValueT, InsertMessagePromptT, createResearchISchema } from "@/src/schemas"
import { DependentValueTable } from "@/src/tables"
import { createAction } from "@/utils/actions/create-action"
import { getParamsFromHeaders } from "@/utils/get-params-from-headers"
import { redirect } from "next/navigation"

export const createResearchAction = createAction(
	"signedIn",
	createResearchISchema.strict,
)(async ({ user, input }) => {
	const forkedResearchId = await getParamsFromHeaders("/new")

	const systemMessagePrompt = SlashEditorFeature.tiptapStringToCustomString(input.systemMessagePrompt.text)
	const userMessagePrompt = SlashEditorFeature.tiptapStringToCustomString(input.userMessagePrompt.text)
	const evalPrompt = SlashEditorFeature.tiptapStringToCustomString(input.evalPrompt.text)

	const newResearch = await ResearchRepo.insert({
		userId: user.userId,
		name: input.research.name,
		forkedResearchId: forkedResearchId ? Number.parseInt(forkedResearchId) : null,
	})

	await transaction(async () => {
		const newIndependentVariable = await IndependentVariableRepo.insert({ researchId: newResearch.id, name: input.independentVariable.name })
		const independentValuesToInsert: InsertIndependentValueT[] = input.independentVariable.values.map(value => ({
			independentVariableId: newIndependentVariable.id,
			value,
		}))
		const newIndependentValues = await IndependentValueRepo.insertMany(independentValuesToInsert)

		const blockingVariablesToInsert: InsertBlockingVariableT[] = input.blockingVariables.map(blockingVariable => ({
			researchId: newResearch.id,
			name: blockingVariable.name,
		}))
		const newBlockingVariables = await BlockingVariableRepo.insertMany(blockingVariablesToInsert)
		const blockingValesToInsert: InsertBlockingValueT[] = input.blockingVariables.flatMap((blockingVariable, i) =>
			blockingVariable.values.map(value => ({
				blockingVariableId: newBlockingVariables[i].id,
				value,
			})),
		)
		const newBlockingValues = await BlockingValueRepo.insertMany(blockingValesToInsert)

		const messagePromptsToInsert: InsertMessagePromptT[] = [
			{ researchId: newResearch.id, role: "system", text: systemMessagePrompt },
			{ researchId: newResearch.id, role: "user", text: userMessagePrompt },
		]
		const newMessagePrompts = await MessagePromptRepo.insertMany(messagePromptsToInsert)

		const newEvalPrompt = await EvalPromptRepo.insert({ researchId: newResearch.id, text: evalPrompt })

		const dependentValuesToInsert: InsertDependentValueT[] = DependentValueTable.assignColors(input.dependentValues.map(value => ({ researchId: newResearch.id, value })))
		const newDependentValues = await DependentValueRepo.insertMany(dependentValuesToInsert)
	}).onError(async () => {
		await ResearchRepo.delete(newResearch.id)
	})

	redirect(`/user/${user.userId}/research/${newResearch.id}`)
})
