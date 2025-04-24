import { isResultValid } from "./is-result-valid"

export const resultIsValid = async <T>(actionO: Promise<T | { error: string }>) => {
	const result = await actionO

	if (isResultValid(result)) {
		return result
	} else {
		throw new Error(result.error)
	}
}
