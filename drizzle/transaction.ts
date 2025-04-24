export const transaction = <T>(callback: () => Promise<T>) => ({
	onError: async (onError: () => Promise<any>) => {
		try {
			return await callback()
		} catch (error: any) {
			await onError()

			throw error
		}
	},
})
