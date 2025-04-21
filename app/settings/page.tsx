import { PageTabs, PageTabsList } from "@/components/page-tabs"
import { TabsContent } from "@/components/ui/tabs"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { CircleUserRoundIcon, KeyIcon } from "lucide-react"
import { AccountPage } from "./_components/account-page"
import { APIKeyPage } from "./_components/api-key-page"
import { APIKeyRepo } from "@/src/repos"

const config = {
	tabs: [
		{ key: "account", title: "Account", icon: CircleUserRoundIcon },
		{ key: "apiKey", title: "API Key", icon: KeyIcon },
	],
} as const

const Page = async (props: { searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams
	const user = await authProcedure("signedIn")
	const apiKey = await APIKeyRepo.query(user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return (
		<div className="w-full max-w-3xl">
			<PageTabs tabs={config.tabs} searchParams={searchParams}>
				<PageTabsList tabs={config.tabs} />

				<TabsContent value="account">
					<AccountPage />
				</TabsContent>

				<TabsContent value="apiKey">
					<APIKeyPage maskedAPIKey={maskedAPIKey} />
				</TabsContent>
			</PageTabs>
		</div>
	)
}

export default Page
