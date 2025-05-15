import { useState } from "react"
import { isResultValid } from "./is-result-valid"

export const useAction = <Input extends any[], Output extends any | { error: string } | undefined>(serverAction: (...input: Input) => Promise<Output>) => {
	const [result, setResult] = useState<Output | undefined>(undefined)
	const [isValid, setIsValid] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const execute = async (...input: Input) => {
		setIsLoading(true)

		const result = await serverAction(...input)

		const isValid = isResultValid(result)

		setResult(result)
		setIsValid(isValid)
		setIsLoading(false)

		return { result, isValid } as { result: Exclude<Output, { error: string } | undefined>; isValid: true } | { result: { error: string }; isValid: false }
	}

	return {
		...({ result, isValid } as { result: Exclude<Output, { error: string } | undefined>; isValid: true } | { result: { error: string }; isValid: false }),
		isLoading,
		execute,
	}
}
