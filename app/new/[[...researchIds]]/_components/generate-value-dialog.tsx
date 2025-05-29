"use client"

import { generateValueAction } from "@/actions/research/create-research/generate-value.action"
import { LoadingButton } from "@/components/buttons/loading-button"
import { Dialog } from "@/components/dialog"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormCheckbox } from "@/components/form/client/form-checkbox"
import { FormSlider } from "@/components/form/client/form-slider"
import { FormTextarea } from "@/components/form/client/form-textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CreateResearchI } from "@/src/schemas"
import { Variable } from "@/src/schemas/features/variable.schema"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { cn } from "@/utils/cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, PlusIcon, SparkleIcon } from "lucide-react"
import { useState } from "react"
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

export const GenerateValueDialog = (props: { onSubmit: (values: string[]) => void; form: UseFormReturn<CreateResearchI>; variable: Variable; blockingIndex?: number }) => {
	const [isOpen, setIsOpen] = useState(false)

	const promptSchema = z.object({ prompt: z.string(), count: z.number().array() })
	const promptForm = useForm({ resolver: zodResolver(promptSchema), defaultValues: { prompt: "", count: [10] } })

	const valueSchema = z.object({ values: z.object({ value: z.string(), isChecked: z.boolean() }).array() })
	const valueForm = useForm({ resolver: zodResolver(valueSchema) })

	const valueFields = useFieldArray({
		control: valueForm.control,
		name: "values",
	})

	const count = promptForm.watch("count")

	const onPromptSubmit = async (input: z.infer<typeof promptSchema>, options?: { currentValues?: string[] }) => {
		const formValues = props.form.getValues()
		const result = await generateValueAction({
			formValues,
			variable: props.variable,
			blockingIndex: props.blockingIndex,
			count: input.count[0],
			prompt: input.prompt,
			currentValues: options?.currentValues,
		})

		if (isResultValid(result)) {
			const values = result.values.map(value => ({ value, isChecked: true }))
			if (options?.currentValues?.length) {
				valueFields.append(values)
			} else {
				valueFields.replace(values)
			}
		}
	}

	const onValueSubmit = async (input: z.infer<typeof valueSchema>) => {
		const values = input.values.filter(v => v.isChecked).map(v => v.value)
		props.onSubmit(values)
		setIsOpen(false)
		valueFields.remove()
	}

	const onGenerateMore = async () => {
		const promptFormValues = promptForm.getValues()
		const currentValues = valueForm.getValues().values.map(obj => obj.value)
		await onPromptSubmit(promptFormValues, { currentValues })
	}

	const onValueReset = () => {
		valueFields.remove()
	}

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			triggerButton={<Button>Generate</Button>}
			icon={<SparkleIcon />}
			title="Generate Variables"
			contentProps={{ className: "max-w-xl flex flex-col" }}
		>
			<Form {...promptForm} onSubmit={onPromptSubmit}>
				<FormTextarea name="prompt" maxRows={5} placeholder="Instructions..." />
				<FormSlider name="count" label="Number to generate" minValue={1} maxValue={100} />
				<FormButton>Generate</FormButton>
			</Form>

			<Form {...valueForm} onSubmit={onValueSubmit} className="relative h-0 flex-1 overflow-scroll px-3">
				<div className="space-y-2">
					{valueFields.fields.map((field, i) => (
						<div key={field.id} className={cn("relative flex w-full items-center gap-3 rounded-md border border-input p-1 px-2 outline-none has-data-[state=checked]:border-primary/50")}>
							<FormCheckbox name={`values.${i}.isChecked`} className="after:absolute after:inset-0" />
							<Label>{field.value}</Label>
						</div>
					))}
				</div>

				{valueFields.fields.length ? (
					<>
						<div className="sticky bottom-0 space-y-2 pt-4">
							<div className="grid grid-cols-2 items-center gap-2">
								<Button variant="red" onClick={onValueReset}>
									Clear
								</Button>
								<LoadingButton type="button" onClick={onGenerateMore} variant="secondary">
									<PlusIcon />
									{count[0]} More
								</LoadingButton>
							</div>

							<FormButton className="mt-0" variant="green">
								<CheckIcon />
								Save
							</FormButton>
						</div>
					</>
				) : null}
			</Form>
		</Dialog>
	)
}
