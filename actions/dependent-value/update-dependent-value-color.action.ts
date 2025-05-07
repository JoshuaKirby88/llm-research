"use server"

import { DependentValueRepo } from "@/src/repos"
import { dependentValueSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const updateDependentValueColorAction = createAction(
	"signedIn",
	z.object({ oldDependentValues: dependentValueSchema.array(), form: z.record(z.string(), z.string()) }),
)(async ({ input }) => {
	const formDependentValues = Object.entries(input.form).map(([id, color]) => ({ id: Number.parseInt(id), color }))
	const dependentValuesToUpdate = formDependentValues.filter(dVal => input.oldDependentValues.find(oldDVal => oldDVal.id === dVal.id)!.color != dVal.color)

	if (!dependentValuesToUpdate.length) {
		return
	}

	await DependentValueRepo.updateColors(dependentValuesToUpdate)

	revalidatePath("/")
})
