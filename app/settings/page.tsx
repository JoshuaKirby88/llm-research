import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import { APIKey } from "@/drizzle/schema"
import { authProcedure } from "@/src/services/auth-procedure/auth-procedure"
import { APIKeyTable } from "@/src/tables"
import { eq } from "drizzle-orm"
import { CircleUserRoundIcon, KeyIcon } from "lucide-react"
import { AccountPage } from "./_components/account-page"
import { APIKeyPage } from "./_components/api-key-page"

const config = {
	tabs: [
		{ key: "account", title: "Account", icon: CircleUserRoundIcon },
		{ key: "apiKey", title: "API Key", icon: KeyIcon },
	],
} as const

const Page = async () => {
	const user = await authProcedure("signedIn")
	const apiKey = await db.query.APIKey.findFirst({
		where: eq(APIKey.userId, user.userId),
	})
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return (
		<div className="w-full max-w-3xl">
			<Tabs defaultValue={config.tabs[0].key}>
				<TabsList className="mb-10">
					{config.tabs.map(tab => (
						<TabsTrigger key={tab.key} value={tab.key} className="gap-2">
							<tab.icon className="text-muted-foreground" />
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="account">
					<AccountPage />
				</TabsContent>

				<TabsContent value="apiKey">
					<APIKeyPage maskedAPIKey={maskedAPIKey} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Page
