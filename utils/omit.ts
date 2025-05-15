export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pretty<Omit<T, K>> => {
	const result = { ...obj }
	for (const key of keys) {
		delete result[key as keyof typeof result]
	}
	return result
}
