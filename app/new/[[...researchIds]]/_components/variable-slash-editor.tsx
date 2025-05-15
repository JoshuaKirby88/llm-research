"use client"

import { FormSlashEditor } from "@/components/form/client/form-slash-editor"
import { Suggestion } from "@/components/slash-editor"
import { SlashEditorFeature } from "@/src/features"
import { CreateResearchI } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { BotMessageSquareIcon, SquareChevronRightIcon, VariableIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"

const config = {
	createVariableSuggestion: (name: string, values: string[]): Suggestion => ({
		id: name,
		icon: VariableIcon,
		label: name,
		description: values.map(v => `"${v}"`).join(" | "),
	}),
	createPromptSuggestion: (role: "system" | "user"): Suggestion => ({
		id: VariableTable.messageToVarName({ role, isCompletion: false }),
		icon: SquareChevronRightIcon,
		label: VariableTable.messageToVarName({ role, isCompletion: false }),
		description: `The generated ${role} prompt.`,
	}),
	completionSuggestion: {
		id: VariableTable.messageToVarName({ role: "assistant", isCompletion: true }),
		icon: BotMessageSquareIcon,
		label: VariableTable.messageToVarName({ role: "assistant", isCompletion: true }),
		description: "The generated completion, based on the generated messages.",
	} satisfies Suggestion,
	dependentFields: ["systemMessagePrompt.text", "userMessagePrompt.text", "evalPrompt.text"] as const,
}

export const VariableSlashEditor = (props: { name: string; type: "systemMessagePrompt" | "userMessagePrompt" | "evalPrompt" }) => {
	const form = useFormContext<CreateResearchI>()
	const [independent, blockings] = form.watch(["independentVariable", "blockingVariables"])
	const blockingNames = blockings.map(b => b.name)
	const prevRef = useRef({ independentVariableName: independent.name, blockingVariableNames: blockingNames })

	useEffect(() => {
		// Independent variable name
		if (prevRef.current.independentVariableName !== independent.name) {
			config.dependentFields.map(dependentField => {
				const currentValue = SlashEditorFeature.tiptapStringToCustomString(form.getValues(dependentField))
				if (currentValue.includes(VariableTable.toVar(prevRef.current.independentVariableName))) {
					const updatedValue = currentValue.replaceAll(VariableTable.toVar(prevRef.current.independentVariableName), VariableTable.toVar(independent.name))
					form.setValue(dependentField, SlashEditorFeature.customStringToTiptapString(updatedValue))
				}
			})
		}

		// Blocking variable names
		if (blockings.length === prevRef.current.blockingVariableNames.length) {
			const updatedBlockings = prevRef.current.blockingVariableNames.map((prevName, i) => ({ prevName, i })).filter(blocking => blocking.prevName !== blockings[blocking.i].name)

			updatedBlockings.map(updatedBlocking =>
				config.dependentFields.map(dependentField => {
					const currentValue = SlashEditorFeature.tiptapStringToCustomString(form.getValues(dependentField))
					if (currentValue.includes(VariableTable.toVar(updatedBlocking.prevName))) {
						const updatedValue = currentValue.replaceAll(VariableTable.toVar(updatedBlocking.prevName), VariableTable.toVar(blockings[updatedBlocking.i].name))
						form.setValue(dependentField, SlashEditorFeature.customStringToTiptapString(updatedValue))
					}
				}),
			)
		}

		prevRef.current.independentVariableName = independent.name
		prevRef.current.blockingVariableNames = blockingNames
	}, [independent.name, JSON.stringify(blockingNames)])

	const suggestions: Suggestion[] = [
		...(independent.name ? [config.createVariableSuggestion(independent.name, independent.values)] : []),
		...blockings.flatMap(bVar => (bVar.name ? [config.createVariableSuggestion(bVar.name, bVar.values)] : [])),
		...(props.type === "systemMessagePrompt"
			? []
			: props.type === "userMessagePrompt"
				? [config.createPromptSuggestion("system")]
				: props.type === "evalPrompt"
					? [config.createPromptSuggestion("system"), config.createPromptSuggestion("user"), config.completionSuggestion]
					: []),
	]

	return <FormSlashEditor name={props.name} suggestions={suggestions} emptyLabel="No variables defined." placeholder='"/" to reference a variable.' />
}
