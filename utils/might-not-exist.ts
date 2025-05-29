export const mightNotExist = <T>(array: T[], options: { index: number }) => {
	return array.at(options.index)
}
