import { publishResearchAction, unpublishResearchAction } from "@/actions/research/publish-research.action"
import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { Dialog, DialogFooter } from "@/components/dialog"
import { FormActionButton } from "@/components/form/server/form-action-button"
import { IconWrapper } from "@/components/icon-wrapper"
import { Textarea } from "@/components/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ResearchT, TestBatchT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"
import { GlobeIcon, GlobeLockIcon } from "lucide-react"

export const PublishResearchCard = (props: { research: ResearchT; testBatches: TestBatchT[] }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(publishResearchAction, { formData }, { id: props.research.id })
	}

	return (
		<AlertCard>
			<IconWrapper>
				<GlobeIcon />
			</IconWrapper>

			<AlertCardContent
				title={`${props.research.isPublished ? "Unpublish" : "Publish"} Research`}
				description="Allow others to view this research, and run their own tests. You can still continue to run tests."
			>
				{props.research.isPublished ? (
					<FormActionButton variant="yellow" action={unpublishResearchAction.bind(null, { id: props.research.id })}>
						<GlobeLockIcon />
						Unpublish
					</FormActionButton>
				) : (
					<Dialog
						title="Publish Research"
						description="Optionally write a conclusion. You can edit this later."
						triggerButton={
							<Button variant="blue">
								<GlobeIcon />
								Publish
							</Button>
						}
						icon={<GlobeIcon />}
						contentProps={{ className: "max-w-lg" }}
						xButton
					>
						<form action={onSubmit}>
							<Label className="mb-1">
								Conclusion <span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea name="conclusion" minRows={5} className="mb-10" defaultValue={props.research.conclusion ?? ""} />

							<DialogFooter
								confirmCloseButton={
									<Button type="submit" variant="blue">
										<GlobeIcon />
										Publish
									</Button>
								}
								cancelProps={{ children: "Cancel" }}
							/>
						</form>
					</Dialog>
				)}
			</AlertCardContent>
		</AlertCard>
	)
}
