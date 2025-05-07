import { updateResearchAndVectorAction } from "@/actions/research/update-research-and-vector.action"
import { FormButton } from "@/components/form/server/form-button"
import { Textarea } from "@/components/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResearchT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"

export const ResearchNameAndDescriptionAndConclusionForm = (props: { research: ResearchT }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(updateResearchAndVectorAction, { formData }, { id: props.research.id })
	}

	return (
		<form action={onSubmit} className="space-y-3">
			<Label size="xl" className="mb-1">
				Name
			</Label>
			<Input name="name" defaultValue={props.research.name} />

			<Label size="xl" className="mb-1">
				Description
			</Label>
			<Textarea name="description" defaultValue={props.research.description} />

			{props.research.isComplete && (
				<>
					<Label size="xl" className="mb-1">
						Conclusion
					</Label>
					<Textarea name="conclusion" defaultValue={props.research.conclusion ?? ""} />
				</>
			)}

			<FormButton>Save</FormButton>
		</form>
	)
}
