"use server"

import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { researchSchema } from "@/src/schemas"
import { ClerkService } from "@/src/services/clerk.service"
import { createAction } from "@/utils/actions/create-action"
import { destructureArray } from "@/utils/destructure-array"
import { desc, eq } from "drizzle-orm"
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
			dependentValues: true,
			testBatches: {
				with: {
					testModelBatches: {
						with: {
							tests: {
								with: {
									messages: true,
									testToBlockingValues: true,
								},
							},
							testModelBatchResults: true,
						},
					},
					testBatchResults: true,
				},
				orderBy: desc(TestBatch.id),
			},
		},
	})

	if (!result) {
		return
	}

	const {
		contributors,
		independentVariable: _independentVariable,
		blockingVariables: _blockingVariables,
		messagePrompts,
		evalPrompt,
		dependentValues,
		testBatches: _testBatches,
		...research
	} = result
	const { independentValues, ...independentVariable } = _independentVariable!
	const [blockingVariables, { blockingValues }] = destructureArray(_blockingVariables, { blockingValues: true })
	const [testBatches, { testBatchResults, testModelBatches, testModelBatchResults, tests, messages, testToBlockingValues }] = destructureArray(_testBatches, {
		testModelBatches: { tests: { messages: true, testToBlockingValues: true }, testModelBatchResults: true },
		testBatchResults: true,
	})

	const users = await ClerkService.getUsers(contributors.map(c => c.userId))

	return {
		users,
		research,
		contributors,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messagePrompts,
		evalPrompt: evalPrompt!,
		dependentValues,
		testBatches,
		testModelBatches,
		tests,
		testToBlockingValues,
		messages,
		testBatchResults,
		testModelBatchResults,
	}
})
