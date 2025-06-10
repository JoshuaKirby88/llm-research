"use client"

import { createResearchAction } from "@/actions/research/create-research/create-research.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SlashEditorFeature } from "@/src/features"
import { CreateResearchI, createResearchISchema } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpenIcon, RotateCcwIcon } from "lucide-react"
import { FieldPath, useFieldArray, useForm } from "react-hook-form"
import { BlockingVariableField } from "./blocking-variable-field"
import { DependentVariableField } from "./dependent-variable-field"
import { EvaluationField } from "./evaluation-field"
import { IndependentVariableField } from "./independent-variable-field"
import { MessageTemplateField } from "./message-template-field"
import { ResearchQuestionField } from "./research-question-field"

const config = {
	exampleValues: {
		research: { name: "Does mixing 2 language affect accuracy?" },
		independentVariable: { name: "First Language", values: ["English", "Japanese"] },
		blockingVariables: [
			{ name: "Second Language", values: ["English", "Japanese"] },
			{
				name: "Story Topic",
				values: ["A Day in the Life of a Time Traveler", "The Secret Garden of a Forgotten City", "A Lost Letter from the Past"],
			},
		],
		messageTemplates: [
			{
				role: "system",
				text: `Create a story that can be enjoyed in around ~30 minutes.
The purpose of the story is to test the reading and recall abilities.
So, the story should include many names, facts, and events that are all fictional.
The story should be written in ${VariableTable.toVar("First Language")}.
Topic: ${VariableTable.toVar("Story Topic")}.`,
				isPrompt: true,
			},
			{
				role: "user",
				text: `Story:
"""
${VariableTable.toVar(VariableTable.messageToVarName({ type: "generated", role: "system", count: 1 }))}
"""

I want to test reading and recall abilities.
Please ask a question in ${VariableTable.toVar("Second Language")} about the above story that requires reading and analyzing the story.`,
				isPrompt: true,
			},
		],
		evalPrompt: {
			text: `Quiz Context:
"""
${VariableTable.toVar(VariableTable.messageToVarName({ type: "generated", role: "system", count: 1 }))}
"""

Question:
${VariableTable.toVar(VariableTable.messageToVarName({ type: "generated", role: "user", count: 1 }))}

Answer:
${VariableTable.toVar(VariableTable.messageToVarName({ type: "completion", role: "assistant", count: 1 }))}

Is the answer correct?`,
		},
		dependentValues: ["Correct", "Incorrect"],
	} satisfies CreateResearchI,
	formatDefaultValues: (values: Partial<CreateResearchI>): Partial<CreateResearchI> => ({
		...values,
		messageTemplates: values.messageTemplates?.map(mp => ({ role: mp.role, text: SlashEditorFeature.customStringToTiptapString(mp.text), isPrompt: mp.isPrompt })),
		evalPrompt: values.evalPrompt ? { text: SlashEditorFeature.customStringToTiptapString(values.evalPrompt.text) } : undefined,
	}),
}

export const CreateResearchForm = (props: { defaultValues: Partial<CreateResearchI> }) => {
	const form = useForm<CreateResearchI>({
		resolver: zodResolver(createResearchISchema.strict),
		defaultValues: config.formatDefaultValues(props.defaultValues),
		reValidateMode: "onChange",
		mode: "onChange",
	})

	const messageTemplateFields = useFieldArray({
		control: form.control,
		name: "messageTemplates",
	})

	const onSubmit = async (input: CreateResearchI) => {
		const result = await createResearchAction(input)
		isResultValid(result)
	}

	const resetForm = () => {
		form.reset(config.formatDefaultValues(props.defaultValues))
	}

	const resetToExampleForm = () => {
		form.reset(config.formatDefaultValues(config.exampleValues))
	}

	const appendGeneratedValues = (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => {
		const existing = form.getValues(input.formKey) as string[]
		const uniqueValues = input.values.filter(value => !existing.includes(value))
		form.setValue(input.formKey, [...existing, ...uniqueValues])
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="space-y-10">
			<div className="flex items-center justify-between">
				<h1 className="font-semibold text-3xl">New Research</h1>

				<div className="flex items-center gap-2">
					<Button type="button" onClick={resetToExampleForm} variant="outline" size="sm">
						<BookOpenIcon />
						Example Research
					</Button>

					<Button type="button" variant="red" size="sm" onClick={resetForm}>
						<RotateCcwIcon />
						Reset Form
					</Button>
				</div>
			</div>

			<Separator className="-translate-x-[50%] mb-20 ml-[50%] min-w-screen" />

			<div className="space-y-10">
				<ResearchQuestionField />

				<IndependentVariableField appendGeneratedValues={appendGeneratedValues} />

				<BlockingVariableField appendGeneratedValues={appendGeneratedValues} />

				<MessageTemplateField messageTemplateFields={messageTemplateFields} />

				<EvaluationField messageTemplateFields={messageTemplateFields} />

				<DependentVariableField appendGeneratedValues={appendGeneratedValues} />
			</div>

			<FormButton variant="green" size="lg">
				Create Research
			</FormButton>
		</Form>
	)
}
