export const parseFormRouteHandlerPayload = <T>(formData: FormData) => {
	const encoded = formData.get("payload")
	const json = decodeURIComponent(encoded as string)
	const payload = JSON.parse(json)

	return payload as T
}
