"use client"

import { FormSlashEditor } from "@/components/form/client/form-slash-editor"
import { Suggestion } from "@/components/slash-editor"
import { SlashEditorFeature } from "@/src/features"
import { CreateResearchI } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { BotMessageSquareIcon, SquareChevronRightIcon, VariableIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { UseFieldArrayReturn, useFormContext } from "react-hook-form"

const config = {
	createVariableSuggestion: (name: string, values: string[]): Suggestion => ({
		id: name,
		icon: VariableIcon,
		label: name,
		description: values.map(v => `"${v}"`).join(" | "),
	}),
	createPromptSuggestion: (role: "system" | "user" | "assistant", index: number, messageTemplateFields: UseFieldArrayReturn<CreateResearchI, "messageTemplates", "id">): Suggestion => ({
		id: VariableTable.messageToVarName({ type: "generated", role, count: config.messageTemplateIndexToCount(index, messageTemplateFields) }),
		icon: SquareChevronRightIcon,
		label: VariableTable.messageToVarName({ type: "generated", role, count: config.messageTemplateIndexToCount(index, messageTemplateFields) }),
		description: `The generated ${role} prompt.`,
	}),
	completionSuggestion: {
		id: VariableTable.messageToVarName({ type: "completion", role: "assistant", count: 1 }),
		icon: BotMessageSquareIcon,
		label: VariableTable.messageToVarName({ type: "completion", role: "assistant", count: 1 }),
		description: "The generated completion, based on the generated messages.",
	} satisfies Suggestion,
	dependentFields: ["evalPrompt.text"] as const,
	messageTemplateIndexToCount(index: number, messageTemplateFields: UseFieldArrayReturn<CreateResearchI, "messageTemplates", "id">) {
		const role = messageTemplateFields.fields[index].role
		const messageOfRoleCount = messageTemplateFields.fields.slice(0, index + 1).filter(field => field.role === role).length
		return messageOfRoleCount
	},
}

export const VariableSlashEditor = (props: { name: string; index: number; messageTemplateFields: UseFieldArrayReturn<CreateResearchI, "messageTemplates", "id"> }) => {
	const form = useFormContext<CreateResearchI>()
	const [independent, blockings] = form.watch(["independentVariable", "blockingVariables"])
	const blockingNames = blockings.map(b => b.name)
	const prevRef = useRef({ independentVariableName: independent.name, blockingVariableNames: blockingNames })

	useEffect(() => {
		// Independent variable name
		if (prevRef.current.independentVariableName !== independent.name) {
			form.getValues("messageTemplates").forEach((field, i) => {
				const currentValue = SlashEditorFeature.tiptapStringToCustomString(field.text)
				if (currentValue.includes(VariableTable.toVar(prevRef.current.independentVariableName))) {
					const updatedValue = currentValue.replaceAll(VariableTable.toVar(prevRef.current.independentVariableName), VariableTable.toVar(independent.name))
					props.messageTemplateFields.update(i, { ...field, text: SlashEditorFeature.customStringToTiptapString(updatedValue) })
				}
			})

			config.dependentFields.forEach(dependentField => {
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

			updatedBlockings.forEach(updatedBlocking => {
				form.getValues("messageTemplates").forEach((field, i) => {
					const currentValue = SlashEditorFeature.tiptapStringToCustomString(field.text)
					if (currentValue.includes(VariableTable.toVar(updatedBlocking.prevName))) {
						const updatedValue = currentValue.replaceAll(VariableTable.toVar(updatedBlocking.prevName), VariableTable.toVar(blockings[updatedBlocking.i].name))
						props.messageTemplateFields.update(i, { ...field, text: SlashEditorFeature.customStringToTiptapString(updatedValue) })
					}
				})

				config.dependentFields.forEach(dependentField => {
					const currentValue = SlashEditorFeature.tiptapStringToCustomString(form.getValues(dependentField))
					if (currentValue.includes(VariableTable.toVar(updatedBlocking.prevName))) {
						const updatedValue = currentValue.replaceAll(VariableTable.toVar(updatedBlocking.prevName), VariableTable.toVar(blockings[updatedBlocking.i].name))
						form.setValue(dependentField, SlashEditorFeature.customStringToTiptapString(updatedValue))
					}
				})
			})
		}

		prevRef.current.independentVariableName = independent.name
		prevRef.current.blockingVariableNames = blockingNames
	}, [independent.name, JSON.stringify(blockingNames)])

	const suggestions: Suggestion[] = [
		...(independent.name ? [config.createVariableSuggestion(independent.name, independent.values)] : []),
		...blockings.flatMap(bVar => (bVar.name ? [config.createVariableSuggestion(bVar.name, bVar.values)] : [])),
		...props.messageTemplateFields.fields.slice(0, props.index).map((field, i) => config.createPromptSuggestion(field.role, i, props.messageTemplateFields)),
		...(props.index === props.messageTemplateFields.fields.length - 1 ? [config.completionSuggestion] : []),
	]

	return <FormSlashEditor name={props.name} suggestions={suggestions} emptyLabel="No variables defined." placeholder='"/" to reference a variable.' />
}
