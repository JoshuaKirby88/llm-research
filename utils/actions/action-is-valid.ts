import { isActionValid } from "./is-action-valid"

export const actionIsValid = async <T>(actionO: Promise<T | { error: string }>) => {
	const result = await actionO

	if (isActionValid(result)) {
		return result
	} else {
		throw new Error(result.error)
	}
}
