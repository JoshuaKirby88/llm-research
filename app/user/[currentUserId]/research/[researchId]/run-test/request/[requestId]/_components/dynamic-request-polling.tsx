import { ClientRedirect } from "@/components/client/client-redirect"
import { ClientToast } from "@/components/client/client-toast"
import { Suspense } from "@/components/suspense"
import { RequestRepo } from "@/src/repos"
import { RequestTable } from "@/src/tables/request.table"
import { after } from "next/server"

type PollResult = ({ redirectUrl: string } | { error: string }) & { deleteRequest?: boolean }

const config = {
	pollingIntervalSeconds: 10,
}

export const DynamicRequestPolling = Suspense(async (props: { params: Promise<NextParam<"currentUserId" | "researchId" | "requestId">> }) => {
	const params = await props.params

	const result = await new Promise<PollResult>(async resolve => {
		const poll = async () => {
			const request = await RequestRepo.query(params.requestId)

			console.log("request", JSON.stringify(request, null, 2))

			return RequestTable.handleRequest(request, {
				onSuccess(request) {
					return {
						redirectUrl: `/user/${params.currentUserId}/research/${params.researchId}/test/${request.successId}`,
						deleteRequest: true,
					}
				},
				onError(request) {
					return {
						error: request.error,
						deleteRequest: true,
					}
				},
				onNoRequest() {
					return { redirectUrl: `/user/${params.currentUserId}/research/${params.researchId}/run-test` }
				},
			})
		}

		for (let i = 0; i < 50; i++) {
			const result: PollResult | undefined = await poll()

			if (result) {
				if (result.deleteRequest) {
					after(async () => {
						await RequestRepo.delete(params.requestId)
					})
				}

				resolve(result)
			}

			await new Promise(resolve => setTimeout(resolve, config.pollingIntervalSeconds ** (Math.floor(i / 10) + 1) * 1000))
		}
	})

	if ("redirectUrl" in result) {
		return <ClientRedirect redirectUrl={result.redirectUrl} />
	} else if ("error" in result) {
		return <ClientToast error={result.error} />
	}
}, null)
