"use server"

import { runTestISchema } from "@/src/schemas"
import { RunTestService } from "@/src/services/run-test.service"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const runTestAction = createAction(
	"signedIn",
	runTestISchema.pick({ researchId: true, models: true, iterations: true }),
)(async ({ user, input }) => {
	const payload = { userId: user.userId, ...input }

	const { research, testModelBatchResults } = await RunTestService.execute(payload)

	const { newTestBatch } = await RunTestService.insertTestBatch(payload, research, testModelBatchResults)

	redirect(`/user/${user.userId}/research/${input.researchId}/test/${newTestBatch.id}`)
})
