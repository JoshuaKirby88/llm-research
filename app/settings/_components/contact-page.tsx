import { AlertCard, AlertCardContent } from "@/components/alert-card"
import { LinkButton } from "@/components/buttons/link-button"
import { IconWrapper } from "@/components/icon-wrapper"
import { GithubIcon } from "@/components/icons/github-icon"
import { buttonVariants } from "@/components/ui/button"
import { AtSignIcon, ExternalLinkIcon, LightbulbIcon, SendIcon } from "lucide-react"

export const ContactPage = () => {
	return (
		<div className="space-y-10">
			<AlertCard>
				<IconWrapper>
					<GithubIcon className="fill-muted-foreground" />
				</IconWrapper>
				<AlertCardContent title="GitHub" description="The GitHub repository is public.">
					<LinkButton href="https://github.com/JoshuaKirby88/llm-research" target="_blank" className={buttonVariants()}>
						View
						<ExternalLinkIcon />
					</LinkButton>
				</AlertCardContent>
			</AlertCard>

			<AlertCard>
				<IconWrapper>
					<LightbulbIcon />
				</IconWrapper>
				<AlertCardContent title="Have a feature?" description="Request new features, vote on features, and report bugs.">
					<LinkButton href="https://llmresearch.featurebase.app" target="_blank" className={buttonVariants()}>
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
