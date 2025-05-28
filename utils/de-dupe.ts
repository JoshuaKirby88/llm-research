export const deDupe = <T>(arr: T[], key: keyof T): T[] => {
	const seen = new Set<T[typeof key]>()
	return arr.filter(item => !seen.has(item[key]) && seen.add(item[key]))
}
