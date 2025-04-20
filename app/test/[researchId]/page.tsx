import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { db } from "@/drizzle/db"
import { APIKey } from "@/drizzle/schema"
import { authProcedure } from "@/src/services/auth-procedure/auth-procedure"
import { APIKeyTable } from "@/src/tables"
import { eq } from "drizzle-orm"
import { RunTestForm } from "./_components/run-test-form"

const Page = async () => {
	const user = await authProcedure("signedIn")
	const apiKey = await db.query.APIKey.findFirst({
		where: eq(APIKey.userId, user.userId),
	})
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	if (!APIKeyTable.keyExists(maskedAPIKey)) {
		return <AddAPIKeyAlertCard />
	}

	return <RunTestForm maskedAPIKey={maskedAPIKey} />
}

export default Page
