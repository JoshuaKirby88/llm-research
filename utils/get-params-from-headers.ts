import { headers } from "next/headers"

export const getParamsFromHeaders = async (path: string): Promise<string | undefined> => {
	const headersList = await headers()
	const referer = headersList.get("referer")!

	return referer.split(`${path}/`)[1]?.split("/")[0]
}
