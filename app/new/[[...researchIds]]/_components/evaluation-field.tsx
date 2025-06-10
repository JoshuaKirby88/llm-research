import { FormCard, FormCardContent, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { CreateResearchI } from "@/src/schemas"
import { RulerIcon } from "lucide-react"
import { UseFieldArrayReturn } from "react-hook-form"
import { VariableSlashEditor } from "./variable-slash-editor"

export const EvaluationField = (props: { messageTemplateFields: UseFieldArrayReturn<CreateResearchI, "messageTemplates", "id"> }) => {
	return (
		<FormCard>
			<FormCardHeader>
				<LabelWithTooltip size="2xl" icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt.">
					Evaluation
				</LabelWithTooltip>
			</FormCardHeader>

			<FormCardContent>
				<VariableSlashEditor name="evalPrompt.text" index={props.messageTemplateFields.fields.length} messageTemplateFields={props.messageTemplateFields} />
			</FormCardContent>
		</FormCard>
	)
}
