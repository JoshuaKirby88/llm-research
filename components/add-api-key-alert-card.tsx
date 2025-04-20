import { KeyIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { AlertCard, AlertCardContent } from "./alert-card"
import { IconWrapper } from "./icon-wrapper"
import { buttonVariants } from "./ui/button"

export const AddAPIKeyAlertCard = () => {
	return (
		<AlertCard>
			<IconWrapper>
				<KeyIcon />
			</IconWrapper>

			<AlertCardContent title="Add an API Key" description="To access this feature, you must have an API key for at least 1 provider." />

			<Link href="/settings?state=apiKey" className={buttonVariants()}>
				<PlusIcon />
				Add Key
			</Link>
		</AlertCard>
	)
}
