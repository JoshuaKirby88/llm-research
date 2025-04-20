"use server"

import { TestRunService } from "@/src/services"
import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const runTestAction = createAction(
	"signedIn",
	TestRunService.schema.pick({ researchId: true, models: true, iterations: true }),
)(async ({ user, input }) => {
	const payload = { userId: user.userId, ...input }

	const { research, testModelBatchResults } = await TestRunService.execute(payload)

	await TestRunService.insertTestBatch(payload, research, testModelBatchResults)

	redirect(`/research/${input.researchId}/test`)
})
