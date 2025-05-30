import { publishResearchAction } from "@/actions/research/publish-research.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { Dialog, DialogFooter } from "@/components/dialog"
import { IconWrapper } from "@/components/icon-wrapper"
import { Textarea } from "@/components/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ResearchT, TestBatchT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"
import { CheckIcon } from "lucide-react"

export const PublishResearchCard = (props: { research: ResearchT; testBatches: TestBatchT[]; children?: React.ReactNode }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(publishResearchAction, { formData }, { id: props.research.id })
	}

	return props.testBatches.length && !props.research.isPublished ? (
		<>
			<AlertCard>
				<IconWrapper>
					<CheckIcon />
				</IconWrapper>

				<AlertCardContent title="Publish Research" description="Allow others to view this research, and run their own tests. You can still continue to run further tests.">
					<Dialog
						title="Publish Research"
						description="Optionally write a conclusion. You can edit this later."
						triggerButton={<Button>Publish</Button>}
						icon={<CheckIcon />}
						contentProps={{ className: "max-w-lg" }}
					>
						<form action={onSubmit}>
							<Label className="mb-1">
								Conclusion <span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea name="conclusion" minRows={5} className="mb-10" />

							<DialogFooter confirmCloseButton={<Button type="submit">Publish</Button>} cancelProps={{ children: "Cancel" }} />
						</form>
					</Dialog>
				</AlertCardContent>
			</AlertCard>

			{props.children}
		</>
	) : null
}
