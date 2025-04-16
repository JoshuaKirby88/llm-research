import { SettingsQuery } from "@/src/features/settings/settings.query"
import { authProcedure } from "@/src/services/auth-procedure/auth-procedure"
import { APIKeyTable } from "@/src/tables/api-key.table"
import { APIKeyPage } from "./_components/api-key-page"
import { SettingsTabs, SettingsTabsContent } from "./_components/tabs"

const Page = async () => {
	const user = await authProcedure("signedIn")
	const apiKey = await SettingsQuery.execute({ userId: user.userId })
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return (
		<div className="w-full max-w-[50rem]">
			<SettingsTabs>
				<SettingsTabsContent value="account"></SettingsTabsContent>

				<SettingsTabsContent value="apiKey">
					<APIKeyPage maskedAPIKey={maskedAPIKey} />
				</SettingsTabsContent>
			</SettingsTabs>
		</div>
	)
}

export default Page
