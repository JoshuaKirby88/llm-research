import { FormInput } from "@/components/form/client/form-input"
import { FormCard, FormCardContent, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { MessageCircleQuestionIcon } from "lucide-react"

export const ResearchQuestionField = () => {
	return (
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
	)
}
