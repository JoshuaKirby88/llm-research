"use server"

import { runTestISchema } from "@/src/schemas"
import { RunTestService } from "@/src/services/run-test/run-test.service"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const runTestAction = createAction(
	"signedIn",
	runTestISchema.pick({ researchId: true, models: true, iterations: true }),
)(async ({ user, input }) => {
	const { newTestBatch } = await RunTestService.execute({ userId: user.userId, researchId: input.researchId, models: input.models, iterations: input.iterations })

	redirect(`/user/${user.userId}/research/${input.researchId}/test/${newTestBatch.id}`)
})
