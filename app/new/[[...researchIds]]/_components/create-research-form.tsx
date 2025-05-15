"use client"

import { createResearchAction } from "@/actions/research/create-research/create-research.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { FormTagInput } from "@/components/form/client/form-tag-input"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SlashEditorFeature } from "@/src/features"
import { CreateResearchI, createResearchISchema } from "@/src/schemas"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { HardHatIcon, MessageCircleQuestionIcon, RulerIcon, StarIcon, VariableIcon } from "lucide-react"
import React from "react"
import { FieldPath, useFieldArray, useForm } from "react-hook-form"
import { GenerateValueDialog } from "./generate-value-dialog"
import { VariableSlashEditor } from "./variable-slash-editor"

const config = {
	exampleValues: {
		research: { name: "Does using multiple language affect LLM?" },
		independentVariable: { name: "Language", values: ["English", "Japanese"] },
		blockingVariables: [
			{ name: "Sub Language", values: ["English", "Japanese"] },
			{ name: "Topic", values: ["Toy Store A", "Car Maker B"] },
		],
		systemMessagePrompt: {
			text: "Generate made up information about {{Topic}} in {{Language}}.",
		},
		userMessagePrompt: {
			text: '"""\n{{System Prompt}}\n"""\n\nAsk a question that can only be answered, given the above information, in {{Sub Language}}.',
		},
		evalPrompt: {
			text: 'Based on this information:\n"""\n{{System Prompt}}\n"""\n\nIs this answer correct?\nQuestion:\n{{User Prompt}}\nAnswer:\n{{Completion}}',
		},
		dependentValues: ["Correct", "Incorrect"],
	} satisfies CreateResearchI,
	formatDefaultValues: (values: Partial<CreateResearchI>) => ({
		...values,
		systemMessagePrompt: values.systemMessagePrompt ? { text: SlashEditorFeature.customStringToTiptapString(values.systemMessagePrompt.text) } : undefined,
		userMessagePrompt: values.userMessagePrompt ? { text: SlashEditorFeature.customStringToTiptapString(values.userMessagePrompt.text) } : undefined,
		evalPrompt: values.evalPrompt ? { text: SlashEditorFeature.customStringToTiptapString(values.evalPrompt.text) } : undefined,
	}),
}

export const CreateResearchForm = (props: { defaultValues: Partial<CreateResearchI> }) => {
	const form = useForm<CreateResearchI>({
		resolver: zodResolver(createResearchISchema),
		defaultValues: config.formatDefaultValues(props.defaultValues),
		reValidateMode: "onChange",
		mode: "onChange",
	})

	const blockingVariableFields = useFieldArray({
		control: form.control,
		name: "blockingVariables",
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

	const appendIndependentValues = (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => {
		const existing = form.getValues(input.formKey) as string[]
		const uniqueValues = input.values.filter(value => !existing.includes(value))
		form.setValue(input.formKey, [...existing, ...uniqueValues])
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<div className="mb-10 flex items-center gap-10">
				<Button type="button" onClick={resetToExampleForm} variant="link">
					View Example Research
				</Button>

				<Button type="button" variant="link" onClick={resetForm}>
					Reset
				</Button>
			</div>

			<LabelWithTooltip size="3xl" icon={<MessageCircleQuestionIcon />} title="What do you want to know?" description="Write down a question you have about behaviours of LLMs.">
				Research Question
			</LabelWithTooltip>
			<FormInput name="research.name" />

			<LabelWithTooltip
				className="mt-10"
				size="2xl"
				icon={<VariableIcon />}
				title="Which One Was This Again?"
				description="This is what you change on purpose to see how it affects the outcome."
			>
				Independent variable
			</LabelWithTooltip>

			<Label>Name</Label>
			<FormInput name="independentVariable.name" />
			<Label>Variables</Label>
			<div className="flex items-start gap-4">
				<FormTagInput name="independentVariable.values" className="w-full" />
				<GenerateValueDialog onSubmit={values => appendIndependentValues({ formKey: "independentVariable.values", values })} form={form} variable="independent" />
			</div>

			<LabelWithTooltip
				size="2xl"
				className="mt-10"
				icon={<VariableIcon />}
				title="Generate Test Variations"
				description="Add variables here with multiple values. The system will automatically create test runs for every possible combination you define."
			>
				Blocking variables
			</LabelWithTooltip>

			{blockingVariableFields.fields.map((field, i) => (
				<React.Fragment key={field.id}>
					<Label>Name</Label>
					<FormInput name={`blockingVariables.${i}.name`} />
					<Label>Variables</Label>
					<div className="flex items-start gap-4">
						<FormTagInput name={`blockingVariables.${i}.values`} className="w-full" />
						<GenerateValueDialog onSubmit={values => appendIndependentValues({ formKey: `blockingVariables.${i}.values`, values })} blockingIndex={i} form={form} variable="blocking" />
					</div>
					<Button type="button" className="w-full" variant="red" onClick={() => blockingVariableFields.remove(i)}>
						Delete Blocking Variable
					</Button>
					<Separator className="my-5" />
				</React.Fragment>
			))}
			<Button type="button" className="w-full" variant="secondary" onClick={() => blockingVariableFields.append({ name: "", values: [] })}>
				Add Blocking Variable
			</Button>

			<LabelWithTooltip
				size="2xl"
				className="mt-10"
				icon={<HardHatIcon />}
				title="Can We Prompt it? Yes We Can!"
				description="You are prompting an LLM to generate prompts that will be used to generate an answer, which we are researching."
			>
				Message prompt
			</LabelWithTooltip>

			<Label>System</Label>
			<VariableSlashEditor name="systemMessagePrompt.text" type="systemMessagePrompt" />
			<Label>User</Label>
			<VariableSlashEditor name="userMessagePrompt.text" type="userMessagePrompt" />

			<LabelWithTooltip className="mt-10" size="2xl" icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt.">
				Evaluation prompt
			</LabelWithTooltip>

			<VariableSlashEditor name="evalPrompt.text" type="evalPrompt" />

			<LabelWithTooltip className="mt-10" size="2xl" icon={<StarIcon />} title="Possible Results" description="The LLM will choose an option, based on the above instructions you defined.">
				Dependent Variable
			</LabelWithTooltip>

			<div className="flex items-start gap-4">
				<FormTagInput name="dependentValues" className="w-full" />
				<GenerateValueDialog onSubmit={values => appendIndependentValues({ formKey: "dependentValues", values })} form={form} variable="dependent" />
			</div>

			<FormButton className="mt-10">Submit</FormButton>
		</Form>
	)
}
