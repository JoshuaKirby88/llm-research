import { downloadResearchAction } from "@/actions/research/download-research.action"
import { ActionI } from "@/utils/actions/create-action"
import { resultIsValid } from "@/utils/actions/result-is-valid"
import { parseFormRouteHandlerPayload } from "@/utils/parse-form-route-handler-payload"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
	const formData = await request.formData()
	const input = parseFormRouteHandlerPayload<ActionI<typeof downloadResearchAction>>(formData)

	const { fileName, data } = await resultIsValid(downloadResearchAction(input))

	return new NextResponse(JSON.stringify(data, null, 2), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Content-Disposition": `attachment; filename="${fileName}"`,
		},
	})
}
