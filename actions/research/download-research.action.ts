"use server"

import { db } from "@/drizzle/db"
import { Research, TestBatch } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { researchSchema, testBatchSchema } from "@/src/schemas"
import { createAction } from "@/utils/actions/create-action"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { z } from "zod"

export const downloadResearchAction = createAction(
	"public",
	z.object({ researchId: researchSchema.shape.id, testBatchId: testBatchSchema.shape.id.optional() }),
)(async ({ user, input }) => {
	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, input.researchId), ResearchRepo.getPublicWhere({ userId: user.userId })),
		with: {
			independentVariable: { with: { independentValues: true } },
			blockingVariables: { with: { blockingValues: true } },
			dependentValues: true,
			messagePrompts: true,
			evalPrompt: true,
			testBatches: {
				where: input.testBatchId ? eq(TestBatch.id, input.testBatchId) : undefined,
				with: {
					testModelBatches: {
						with: {
							tests: {
								with: {
									testToBlockingValues: true,
									messages: true,
									evals: true,
								},
							},
							testModelBatchResults: true,
						},
					},
					testBatchResults: true,
				},
			},
		},
	})

	if (!result) {
		notFound()
	}

	return {
		fileName: input.testBatchId ? `testBatch-${input.testBatchId}` : `research-${input.researchId}`,
		data: { research: result },
	}
})
