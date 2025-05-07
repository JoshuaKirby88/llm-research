import { completeResearchAction } from "@/actions/research/complete-research.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { Dialog, DialogFooter } from "@/components/dialog"
import { IconWrapper } from "@/components/icon-wrapper"
import { Textarea } from "@/components/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ResearchT, TestBatchT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"
import { CheckIcon } from "lucide-react"

export const CompleteResearchCard = (props: { research: ResearchT; testBatches: TestBatchT[]; children?: React.ReactNode }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(completeResearchAction, { formData }, { id: props.research.id })
	}

	return props.testBatches.length && !props.research.isComplete ? (
		<>
			<AlertCard>
				<IconWrapper>
					<CheckIcon />
				</IconWrapper>

				<AlertCardContent title="Complete Research" description="Complete a research to make it public. You can still run tests.">
					<Dialog
						title="Complete Research"
						description="Optionally write a conclusion. You can edit this later."
						triggerButton={<Button>Complete Research</Button>}
						icon={<CheckIcon />}
						contentProps={{ className: "max-w-lg" }}
					>
						<form action={onSubmit}>
							<Label className="mb-1">
								Conclusion <span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea name="conclusion" minRows={5} className="mb-10" />

							<DialogFooter confirmCloseButton={<Button type="submit">Complete</Button>} cancelProps={{ children: "Cancel" }} />
						</form>
					</Dialog>
				</AlertCardContent>
			</AlertCard>

			{props.children}
		</>
	) : null
}
