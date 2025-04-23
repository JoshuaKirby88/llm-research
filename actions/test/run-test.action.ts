"use server"

import { runTestSchema } from "@/src/schemas/features/run-test.schema"
import { RunTestService } from "@/src/services/run-test.service"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const runTestAction = createAction(
	"signedIn",
	runTestSchema.pick({ researchId: true, models: true, iterations: true }),
)(async ({ user, input }) => {
	const payload = { userId: user.userId, ...input }

	const { research, testModelBatchResults } = await RunTestService.execute(payload)

	const result = await RunTestService.insertTestBatch(payload, research, testModelBatchResults)

	redirect(`/research/${input.researchId}/test/${result.newTestBatch.id}`)
})
