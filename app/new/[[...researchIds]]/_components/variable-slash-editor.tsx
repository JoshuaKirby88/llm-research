"use client"

import { FormSlashEditor } from "@/components/form/client/form-slash-editor"
import { Suggestion } from "@/components/slash-editor"
import { CreateResearchI } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { BotMessageSquareIcon, SquareChevronRightIcon, VariableIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"

const config = {
	createVariableSuggestion: (name: string, values: string[]): Suggestion => ({
		id: name,
		icon: VariableIcon,
		label: name,
		description: values.map(v => `"${v}"`).join(" | "),
	}),
	createPromptSuggestion: (role: "system" | "user" | "assistant", index: number, messageTemplates: CreateResearchI["messageTemplates"]): Suggestion => ({
		id: VariableTable.messageToVarName({ type: "generated", role, count: config.messageTemplateIndexToCount(index, messageTemplates) }),
		icon: SquareChevronRightIcon,
		label: VariableTable.messageToVarName({ type: "generated", role, count: config.messageTemplateIndexToCount(index, messageTemplates) }),
		description: `The generated ${role} prompt.`,
	}),
	completionSuggestion: {
		id: VariableTable.messageToVarName({ type: "completion", role: "assistant", count: 1 }),
		icon: BotMessageSquareIcon,
		label: VariableTable.messageToVarName({ type: "completion", role: "assistant", count: 1 }),
		description: "The generated completion, based on the generated messages.",
	} satisfies Suggestion,
	messageTemplateIndexToCount(index: number, messageTemplates: CreateResearchI["messageTemplates"]) {
		const role = messageTemplates[index].role
		const messageOfRoleCount = messageTemplates.slice(0, index + 1).filter(field => field.role === role).length
		return messageOfRoleCount
	},
}

export const VariableSlashEditor = (props: { name: string; index: number }) => {
	const form = useFormContext<CreateResearchI>()
	const [independent, blockings, messageTemplates] = form.watch(["independentVariable", "blockingVariables", "messageTemplates"])

	const suggestions: Suggestion[] = [
		...(independent.name ? [config.createVariableSuggestion(independent.name, independent.values)] : []),
		...blockings.flatMap(bVar => (bVar.name ? [config.createVariableSuggestion(bVar.name, bVar.values)] : [])),
		...messageTemplates.slice(0, props.index).map((field, i) => config.createPromptSuggestion(field.role, i, messageTemplates)),
		...(props.index === messageTemplates.length ? [config.completionSuggestion] : []),
	]

	return <FormSlashEditor name={props.name} suggestions={suggestions} emptyLabel="No variables defined." placeholder='"/" to reference a variable.' />
}
