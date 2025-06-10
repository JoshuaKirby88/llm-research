import { FormInput } from "@/components/form/client/form-input"
import { FormTagInput } from "@/components/form/client/form-tag-input"
import { FormCard, FormCardContent, FormCardFooter, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreateResearchI } from "@/src/schemas"
import { VariableIcon } from "lucide-react"
import { FieldPath, useFieldArray, useFormContext } from "react-hook-form"
import { GenerateValueDialog } from "./generate-value-dialog"

export const BlockingVariableField = (props: { appendGeneratedValues: (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => void }) => {
	const form = useFormContext<CreateResearchI>()
	const blockingVariableFields = useFieldArray({
		control: form.control,
		name: "blockingVariables",
	})

	return (
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
									onSubmit={values => props.appendGeneratedValues({ formKey: `blockingVariables.${i}.values`, values })}
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
	)
}
