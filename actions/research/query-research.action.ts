"use server"

import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { BlockingValueT, BlockingVariableT, researchSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { eq } from "drizzle-orm"
import omit from "lodash.omit"
import { z } from "zod"

export const queryResearchAction = createAction(
	"public",
	z.object({ researchId: researchSchema.shape.id }),
)(async ({ input }) => {
	const result = await db.query.Research.findFirst({
		where: eq(Research.id, input.researchId),
		with: {
			contributors: true,
			independentVariable: {
				with: {
					independentValues: true,
				},
			},
			blockingVariables: {
				with: {
					blockingValues: true,
				},
			},
			messagePrompts: true,
			evalPrompt: true,
		},
	})

	if (!result) {
		return
	}

	const { contributors, independentVariable: _independentVariable, blockingVariables: _blockingVariables, messagePrompts, evalPrompt, ...research } = result
	const { independentValues, ...independentVariable } = _independentVariable!
	const { blockingVariables, blockingValues } = _blockingVariables.reduce(
		(acc, curr) => ({ blockingVariables: [...acc.blockingVariables, omit(curr, ["blockingValues"])], blockingValues: [...acc.blockingValues, ...curr.blockingValues] }),
		{ blockingVariables: [] as BlockingVariableT[], blockingValues: [] as BlockingValueT[] },
	)

	return {
		research,
		contributors,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messagePrompts,
		evalPrompt: evalPrompt!,
	}
})
