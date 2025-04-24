"use client"

import { createResearchAction } from "@/actions/research/create-research.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { FormTagInput } from "@/components/form/client/form-tag-input"
import { FormTextarea } from "@/components/form/client/form-textarea"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreateResearchI, createResearchISchema } from "@/src/schemas"
import { isActionValid } from "@/utils/actions/is-action-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { HardHatIcon, MessageCircleQuestionIcon, RulerIcon, StarIcon, VariableIcon } from "lucide-react"
import React from "react"
import { useFieldArray, useForm } from "react-hook-form"

const defaultValues: Partial<CreateResearchI> = { blockingVariables: [{ name: "", values: [] }] }

const exampleValues: CreateResearchI = {
	research: { name: "Does using multiple language affect LLM?" },
	independentVariable: { name: "Language", values: ["English", "Japanese"] },
	blockingVariables: [
		{ name: "Sub language", values: ["English", "Japanese"] },
		{ name: "Topic", values: ["Toy Store A", "Car Maker B"] },
	],
	systemMessagePrompt: { text: "Generate made up information about {topic} in {language}." },
	userMessagePrompt: { text: '"""\n{system}\n"""\n\nAsk a question that can only be answered, given the above information, in English.' },
	evalPrompt: { text: 'Based on this information:\n"""\n{system}\n"""\n\nIs this answer correct?\nQuestion:\n{user}\nAnswer:\n{completion}' },
	dependentValues: ["Correct", "Incorrect"],
}

export const CreateResearchForm = () => {
	const form = useForm<CreateResearchI>({
		resolver: zodResolver(createResearchISchema),
		defaultValues,
	})

	const blockingVariableFields = useFieldArray({
		control: form.control,
		name: "blockingVariables",
	})

	const onSubmit = async (input: CreateResearchI) => {
		const result = await createResearchAction(input)
		isActionValid(result)
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<div className="mb-10 flex items-center gap-10">
				<Button type="button" onClick={() => form.reset(exampleValues)} variant="link">
					View Example Research
				</Button>

				<Button type="button" variant="link" onClick={() => form.reset(defaultValues)}>
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
			<FormTagInput name="independentVariable.values" />

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
					<FormTagInput name={`blockingVariables.${i}.values`} />
					<Button type="button" className="w-full" variant="red" onClick={() => blockingVariableFields.remove(i)}>
						Delete Blocking Variable
					</Button>
					<Separator className="" />
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
			<FormTextarea name="systemMessagePrompt.text" />
			<Label>User</Label>
			<FormTextarea name="userMessagePrompt.text" />

			<LabelWithTooltip className="mt-10" size="2xl" icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt.">
				Evaluation prompt
			</LabelWithTooltip>

			<FormTextarea name="evalPrompt.text" />

			<LabelWithTooltip className="mt-10" size="2xl" icon={<StarIcon />} title="Possible Results" description="The LLM will choose an option, based on the above instructions you defined.">
				Dependent Variable
			</LabelWithTooltip>

			<FormTagInput name="dependentValues" />

			<FormButton className="mt-10">Submit</FormButton>
		</Form>
	)
}
