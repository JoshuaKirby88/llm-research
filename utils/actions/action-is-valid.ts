import { isActionValid } from "./is-action-valid"

type ActionO<T> = Promise<T>

export const actionIsValid = async <T>(actionO: ActionO<T | { error: string }>) => {
	const result = await actionO

	if (isActionValid(result)) {
		return result
	} else {
		throw new Error(result.error)
	}
}
