export const chunk = <T>(array: T[], options: { chunkSize: number; maxChunks?: number }): T[][] => {
	const effectiveChunkSize = options.maxChunks && array.length > options.chunkSize * options.maxChunks ? Math.ceil(array.length / options.maxChunks) : options.chunkSize

	const result: T[][] = []
	for (let i = 0; i < array.length; i += effectiveChunkSize) {
		result.push(array.slice(i, i + effectiveChunkSize))
	}
	return result
}
