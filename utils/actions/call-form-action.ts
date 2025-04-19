export const callFormAction = <T extends any>(action: (args: T) => Promise<any>, formData: FormData, bind?: Partial<T>) => {
	const rawFormData = Object.fromEntries(formData)

	const payload = {
		...rawFormData,
		...bind,
	} as T

	return action(payload)
}
