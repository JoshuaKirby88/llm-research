import { FormInput } from "@/components/form/client/form-input"
import { FormTagInput } from "@/components/form/client/form-tag-input"
import { FormCard, FormCardContent, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Label } from "@/components/ui/label"
import { CreateResearchI } from "@/src/schemas"
import { VariableIcon } from "lucide-react"
import { FieldPath, useFormContext } from "react-hook-form"
import { GenerateValueDialog } from "./generate-value-dialog"

export const IndependentVariableField = (props: { appendGeneratedValues: (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => void }) => {
	const form = useFormContext<CreateResearchI>()

	return (
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
						<GenerateValueDialog onSubmit={values => props.appendGeneratedValues({ formKey: "independentVariable.values", values })} form={form} variable="independent" />
					</div>
				</div>
			</FormCardContent>
		</FormCard>
	)
}
