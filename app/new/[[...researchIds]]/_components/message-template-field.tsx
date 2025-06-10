import { FormSelect, FormSelectItem } from "@/components/form/client/form-select"
import { FormSwitchWithLabels } from "@/components/form/client/form-switch-with-labels"
import { FormCard, FormCardContent, FormCardFooter, FormCardHeader } from "@/components/form/form-card"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Tooltip } from "@/components/tooltip"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreateResearchI } from "@/src/schemas"
import { HardHatIcon } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { VariableSlashEditor } from "./variable-slash-editor"

export const MessageTemplateField = () => {
	const form = useFormContext<CreateResearchI>()
	const messageTemplateFields = useFieldArray({
		control: form.control,
		name: "messageTemplates",
	})

	return (
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

							<VariableSlashEditor name={`messageTemplates.${i}.text`} index={i} />
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
	)
}
