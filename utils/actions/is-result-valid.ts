import { ExternalToast, toast } from "sonner"

export const isResultValid = <T>(result: T | { error: string }, options?: { noToast?: boolean } & ExternalToast): result is T => {
	const toastMessageExists = result && typeof result === "object" && ("success" in result || "info" in result || "error" in result)

	const isNotValid = toastMessageExists && "error" in result

	if (toastMessageExists && !options?.noToast) {
		try {
			const toastType = "success" in result ? "success" : "info" in result ? "info" : "error"

			const value = result[toastType as keyof typeof result]

			if (value && typeof value === "object" && "title" in value && "description" in value) {
				toast[toastType](value.title as string, { ...options, description: value.description as string })
			} else {
				toast[toastType](value as string, options)
			}
		} catch {}
	}

	return !isNotValid
}
