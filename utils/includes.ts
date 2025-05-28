export const includes = <T, K extends T[], A extends K>(key: T, array: A) => {
	return array.includes(key)
}
