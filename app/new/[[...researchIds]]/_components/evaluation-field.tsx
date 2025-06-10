import { FormCard, FormCardContent, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { CreateResearchI } from "@/src/schemas"
import { RulerIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { VariableSlashEditor } from "./variable-slash-editor"

export const EvaluationField = () => {
	const form = useFormContext<CreateResearchI>()
	const [messageTemplates] = form.watch(["messageTemplates"])

	return (
		<FormCard>
			<FormCardHeader>
				<LabelWithTooltip size="2xl" icon={<RulerIcon />} title="How to evaluate the answer?" description="An LLM will evaluate the answer based on this prompt.">
					Evaluation
				</LabelWithTooltip>
			</FormCardHeader>

			<FormCardContent>
				<VariableSlashEditor name="evalPrompt.text" index={messageTemplates.length} />
			</FormCardContent>
		</FormCard>
	)
}
