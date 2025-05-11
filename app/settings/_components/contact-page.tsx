import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { IconWrapper } from "@/components/icon-wrapper"
import { LinkButton } from "@/components/link-button"
import { buttonVariants } from "@/components/ui/button"
import { AtSignIcon, ExternalLinkIcon, LightbulbIcon, SendIcon } from "lucide-react"

export const ContactPage = () => {
	return (
		<div className="space-y-10">
			<AlertCard>
				<IconWrapper>
					<LightbulbIcon />
				</IconWrapper>
				<AlertCardContent title="Have a feature?" description="Request new features, vote on features, and report bugs.">
					<LinkButton href="https://llmresearch.featurebase.app" target="_blank" className={buttonVariants({ variant: "blue" })}>
						Open
						<ExternalLinkIcon />
					</LinkButton>
				</AlertCardContent>
			</AlertCard>

			<AlertCard>
				<IconWrapper>
					<AtSignIcon />
				</IconWrapper>
				<AlertCardContent title="Talk to me directly" description="Email me anything.">
					<LinkButton href="mailto:jojokirby88@gmail.com" className={buttonVariants()}>
						Email me
						<SendIcon />
					</LinkButton>
				</AlertCardContent>
			</AlertCard>
		</div>
	)
}
