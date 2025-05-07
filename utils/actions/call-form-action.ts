export const callFormAction = <T extends any>(action: (args: T) => Promise<any>, form: { key?: keyof T; formData: FormData }, bind?: Partial<T>) => {
	const rawFormData = Object.fromEntries(form.formData)

	const payload = {
		...(form.key ? { [form.key]: rawFormData } : rawFormData),
		...bind,
	} as T

	return action(payload)
}
