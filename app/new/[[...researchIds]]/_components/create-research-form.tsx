"use client"

import { createResearchAction } from "@/actions/research/create-research/create-research.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { FormSelect, FormSelectItem } from "@/components/form/client/form-select"
import { FormSwitchWithLabels } from "@/components/form/client/form-switch-with-labels"
import { FormTagInput } from "@/components/form/client/form-tag-input"
import { FormCard, FormCardContent, FormCardFooter, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Tooltip } from "@/components/tooltip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SlashEditorFeature } from "@/src/features"
import { CreateResearchI, createResearchISchema } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpenIcon, HardHatIcon, MessageCircleQuestionIcon, RotateCcwIcon, RulerIcon, StarIcon, VariableIcon } from "lucide-react"
import { FieldPath, useFieldArray, useForm } from "react-hook-form"
import { GenerateValueDialog } from "./generate-value-dialog"
import { VariableSlashEditor } from "./variable-slash-editor"

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

	const blockingVariableFields = useFieldArray({
		control: form.control,
		name: "blockingVariables",
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

	const appendIndependentValues = (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => {
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
				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip size="2xl" icon={<MessageCircleQuestionIcon />} title="What do you want to know?" description="Write down a question you have about behaviours of LLMs.">
							Research Question
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						<FormInput name="research.name" />
					</FormCardContent>
				</FormCard>

				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip size="2xl" icon={<VariableIcon />} title="Which One Was This Again?" description="This is what you change on purpose to see how it affects the outcome.">
							Independent variable
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						<div className="space-y-1">
							<Label>Name</Label>
							<FormInput name="independentVariable.name" />
						</div>

						<div className="space-y-1">
							<Label>Variables</Label>
							<div className="flex items-start gap-4">
								<FormTagInput name="independentVariable.values" className="w-full" />
								<GenerateValueDialog onSubmit={values => appendIndependentValues({ formKey: "independentVariable.values", values })} form={form} variable="independent" />
							</div>
						</div>
					</FormCardContent>
				</FormCard>

				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip
							size="2xl"
							icon={<VariableIcon />}
							title="Generate Test Variations"
							description="Add variables here with multiple values. The system will automatically create test runs for every possible combination you define."
						>
							Blocking variables
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						{blockingVariableFields.fields.map((field, i) => (
							<div key={field.id} className="group flex flex-col gap-4">
								<div className="space-y-1">
									<Label>Name</Label>
									<FormInput name={`blockingVariables.${i}.name`} />
								</div>

								<div className="space-y-1">
									<Label>Variables</Label>
									<div className="flex items-start gap-4">
										<FormTagInput name={`blockingVariables.${i}.values`} className="w-full" />
										<GenerateValueDialog
											onSubmit={values => appendIndependentValues({ formKey: `blockingVariables.${i}.values`, values })}
											blockingIndex={i}
											form={form}
											variable="blocking"
										/>
									</div>
								</div>

								<Button type="button" className="w-full" variant="red" onClick={() => blockingVariableFields.remove(i)}>
									Delete Variable
								</Button>

								<Separator className="my-6 group-last:hidden" />
							</div>
						))}
					</FormCardContent>

					<FormCardFooter>
						<Button type="button" className="w-full" onClick={() => blockingVariableFields.append({ name: "", values: [] })}>
							Add Variable
						</Button>
					</FormCardFooter>
				</FormCard>

				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip
							size="2xl"
							icon={<HardHatIcon />}
							title="Can We Prompt it? Yes We Can!"
							description="You are prompting an LLM to generate prompts that will be used to generate an answer, which we are researching."
						>
							Messages
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						{messageTemplateFields.fields.map((field, i) => (
							<div key={field.id} className="group flex flex-col gap-4">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<FormSelect name={`messageTemplates.${i}.role`}>
											{[...(i === 0 ? ["system"] : []), "user", "assistant"].map(role => (
												<FormSelectItem key={role} value={role} className="capitalize">
													{role}
												</FormSelectItem>
											))}
										</FormSelect>

										<FormSwitchWithLabels
											name={`messageTemplates.${i}.isPrompt`}
											start={
												<Tooltip onClick={e => e.preventDefault()} tooltip="Only replace variables.">
													Raw
												</Tooltip>
											}
											end={
												<Tooltip onClick={e => e.preventDefault()} tooltip="Replace variables, then generate message using this as the prompt.">
													Prompt
												</Tooltip>
											}
										/>
									</div>

									<VariableSlashEditor name={`messageTemplates.${i}.text`} index={i} messageTemplateFields={messageTemplateFields} />
								</div>

								<Button type="button" className="w-full" variant="red" onClick={() => messageTemplateFields.remove(i)}>
									Delete Message
								</Button>

								<Separator className="my-6 group-last:hidden" />
							</div>
						))}
					</FormCardContent>

					<FormCardFooter>
						<Button
							type="button"
							className="w-full"
							onClick={() => messageTemplateFields.append({ role: messageTemplateFields.fields.at(-1)?.role === "user" ? "assistant" : "user", text: "", isPrompt: false })}
						>
							Add Message
						</Button>
					</FormCardFooter>
				</FormCard>

				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip size="2xl" icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt.">
							Evaluation
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						<VariableSlashEditor name="evalPrompt.text" index={messageTemplateFields.fields.length} messageTemplateFields={messageTemplateFields} />
					</FormCardContent>
				</FormCard>

				<FormCard>
					<FormCardHeader>
						<LabelWithTooltip size="2xl" icon={<StarIcon />} title="Possible Results" description="The LLM will choose an option, based on the above instructions you defined.">
							Dependent Variable
						</LabelWithTooltip>
					</FormCardHeader>

					<FormCardContent>
						<div className="flex items-start gap-4">
							<FormTagInput name="dependentValues" className="w-full" />
							<GenerateValueDialog onSubmit={values => appendIndependentValues({ formKey: "dependentValues", values })} form={form} variable="dependent" />
						</div>
					</FormCardContent>
				</FormCard>
			</div>

			<FormButton variant="green" size="lg">
				Create Research
			</FormButton>
		</Form>
	)
}
