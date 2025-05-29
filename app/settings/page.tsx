import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { Suspense } from "@/components/suspense"
import { TabsContent } from "@/components/ui/tabs"
import { APIKeyRepo } from "@/src/repos"
import { AccountRepo } from "@/src/repos/account.repo"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { CircleUserRoundIcon, KeyIcon, MailIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { AccountPage } from "./_components/account/account-page"
import { APIKeyPage } from "./_components/api-key-page"
import { ContactPage } from "./_components/contact-page"

const config = {
	tabs: [
		{ value: "Account", icon: CircleUserRoundIcon },
		{ value: "API Key", icon: KeyIcon },
		{ value: "Contact Us", icon: MailIcon },
	],
} as const

const Page = Suspense(async (props: { searchParams: Promise<NextSearchParam> }) => {
	const searchParams = await props.searchParams
	const user = await authProcedure("signedIn")

	const [account, apiKey] = await Promise.all([AccountRepo.query(user.userId), APIKeyRepo.query(user.userId)])

	if (!account) {
		notFound()
	}

	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return (
		<div className="w-full max-w-3xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="Account">
					<AccountPage account={account} />
				</TabsContent>

				<TabsContent value="API Key">
					<APIKeyPage maskedAPIKey={maskedAPIKey} />
				</TabsContent>

				<TabsContent value="Contact Us">
					<ContactPage />
				</TabsContent>
			</PageTabs>
		</div>
	)
})

export default Page
