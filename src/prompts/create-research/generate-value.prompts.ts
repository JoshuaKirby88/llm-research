import { CreateResearchI } from "@/src/schemas"

type Input = {
	formValues: CreateResearchI
	prompt: string
	count: number
	variable: "independent" | "blocking" | "dependent"
	blockingIndex?: number
	currentValues?: string[]
}

export const generateValuePrompts = {
	system: `You are an expert research‐assistant AI. Your task is to propose a diverse set of possible values for a single variable, given the context of a planned study.`,
	user: (input: Input) => {
		const variableName =
			input.variable === "blocking"
				? input.formValues.blockingVariables.at(input.blockingIndex!)?.name.trim()
				: input.variable === "independent"
					? input.formValues.independentVariable.name.trim()
					: ""
		const instructionFromResearcher = input.prompt.trim() ? `Instructions from the researcher:\n${input.prompt.trim()}` : ""
		const currentValues = input.currentValues?.length ? `- Generate values in addition to these that are currently generated: ${JSON.stringify(input.currentValues)}` : ""

		return `Current study form that the researcher is filling in:
${JSON.stringify(input.formValues, null, 2)}

---

Please generate a list of candidate values for the ${input.variable} variable${variableName ? ` with name: "${variableName}"` : ""}.
- Ensure the values are mutually distinct, cover a broad range, and make sense in the context of the research.
- Generate ${input.count} values.
- The dependent values are labels that will be assigned to each response by the AI. The value that most appropriately describes the response will be chosed as the evaluation.
${currentValues}

${instructionFromResearcher}`.trim()
	},
}
