"use client"

import { Form } from "@/components/form/form"
import { FormButton } from "@/components/form/form-button"
import { FormInput } from "@/components/form/form-input"
import { FormTagInput } from "@/components/form/form-tag-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { HintTooltip } from "@/components/hint-tooltip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { blockingValueSchema, blockingVariableSchema, evalPromptSchema, independentValueSchema, independentVariableSchema, messagePromptSchema, researchSchema, resultEnumSchema } from "@/src/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { HardHatIcon, MessageCircleQuestionIcon, RulerIcon, StarIcon, VariableIcon } from "lucide-react"
import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
	research: researchSchema.pick({ name: true }),
	independentVariable: independentVariableSchema.pick({ name: true }).extend({ values: independentValueSchema.shape.value.array() }),
	blockingVariables: blockingVariableSchema.pick({ name: true }).extend({ values: blockingValueSchema.shape.value.array() }).array(),
	systemMessagePrompt: messagePromptSchema.pick({ text: true }),
	userMessagePrompt: messagePromptSchema.pick({ text: true }),
	evalPrompt: evalPromptSchema.pick({ text: true }),
	resultEnums: resultEnumSchema.shape.value.array(),
})

export type CreateResearchI = z.infer<typeof schema>

export const CreateResearchForm = () => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { blockingVariables: [{ name: "", values: [] }] },
	})

	const blockingVariableFields = useFieldArray({
		control: form.control,
		name: "blockingVariables",
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		console.log("input", input)
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<Label className="inline text-3xl">Research Question</Label>
			<HintTooltip icon={<MessageCircleQuestionIcon />} title="What do you want to know?" description="Write down a question you have about behaviours of LLMs." />
			<FormInput name="research.name" />

			<h3 className="mt-10 inline text-2xl">Independent variable</h3>
			<HintTooltip icon={<VariableIcon />} title="Which One Was This Again?" description="This is what you change on purpose to see how it affects the outcome." />
			<Label>Name</Label>
			<FormInput name="independentVariable.name" />
			<Label>Variables</Label>
			<FormTagInput name="independentVariable.values" />

			<h3 className="mt-10 inline text-2xl">Blocking variables</h3>
			<HintTooltip
				icon={<VariableIcon />}
				title="Generate Test Variations"
				description="Add variables here with multiple values. The system will automatically create test runs for every possible combination you define."
			/>
			{blockingVariableFields.fields.map((field, i) => (
				<React.Fragment key={field.id}>
					<Label>Name</Label>
					<FormInput name={`blockingVariables.${i}.name`} />
					<Label>Variables</Label>
					<FormTagInput name={`blockingVariables.${i}.values`} />
					<Button className="w-full" variant="destructive" onClick={() => blockingVariableFields.remove(i)}>
						Delete Blocking Variable
					</Button>
					<Separator />
				</React.Fragment>
			))}
			<Button className="w-full" variant="secondary" onClick={() => blockingVariableFields.append({ name: "", values: [] })}>
				Add Blocking Variable
			</Button>

			<h3 className="mt-10 inline text-2xl">Message prompt</h3>
			<HintTooltip
				icon={<HardHatIcon />}
				title="Can We Prompt it? Yes We Can!"
				description="You are prompting an LLM to generate prompts that will be used to generate an answer, which we are researching."
			/>
			<Label>System</Label>
			<FormTextarea name="systemMessagePrompt.text" />
			<Label>User</Label>
			<FormTextarea name="userMessagePrompt.text" />

			<Label className="mt-10 inline text-2xl">Evaluation prompt</Label>
			<HintTooltip icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt." />
			<FormTextarea name="evalPrompt.text" />

			<Label className="mt-10 inline text-2xl">Result enums</Label>
			<HintTooltip icon={<StarIcon />} title="Possible Results" description="The LLM will choose an option, based on the above instructions you defined." />
			<FormTagInput name="resultEnums" />

			<FormButton className="mt-10">Submit</FormButton>
		</Form>
	)
}
