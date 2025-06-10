import { FormTagInput } from "@/components/form/client/form-tag-input"
import { FormCard, FormCardContent, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { CreateResearchI } from "@/src/schemas"
import { StarIcon } from "lucide-react"
import { FieldPath, useFormContext } from "react-hook-form"
import { GenerateValueDialog } from "./generate-value-dialog"

export const DependentVariableField = (props: { appendGeneratedValues: (input: { formKey: FieldPath<CreateResearchI>; values: string[] }) => void }) => {
	const form = useFormContext<CreateResearchI>()

	return (
		<FormCard>
			<FormCardHeader>
				<LabelWithTooltip size="2xl" icon={<StarIcon />} title="Possible Results" description="The LLM will choose an option, based on the above instructions you defined.">
					Dependent Variable
				</LabelWithTooltip>
			</FormCardHeader>

			<FormCardContent>
				<div className="flex items-start gap-4">
					<FormTagInput name="dependentValues" className="w-full" />
					<GenerateValueDialog onSubmit={values => props.appendGeneratedValues({ formKey: "dependentValues", values })} form={form} variable="dependent" />
				</div>
			</FormCardContent>
		</FormCard>
	)
}
