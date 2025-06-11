"use server"

import { ActionError } from "@/src/entities/errors"
import { RequestRepo } from "@/src/repos"
import { runTestISchema } from "@/src/schemas"
import { RunTestService } from "@/src/services/run-test/run-test.service"
import { createAction } from "@/utils/actions/create-action"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { z } from "zod"

export const runTestAction = createAction(
	"signedIn",
	runTestISchema.pick({ researchId: true, models: true, iterations: true }).extend({ requestId: z.string() }),
)(async ({ user, input }) => {
	const newRequest = await RequestRepo.insert({ id: input.requestId, userId: user.userId })

	try {
		const { newTestBatch } = await RunTestService.execute({ userId: user.userId, researchId: input.researchId, models: input.models, iterations: input.iterations })

		await RequestRepo.update(newRequest.id, { isLoading: false, successId: newTestBatch.id })
	} catch (error) {
		if (!isRedirectError(error) && error instanceof ActionError) {
			await RequestRepo.update(newRequest.id, { isLoading: false, error: error.message })
		}
	}
})
