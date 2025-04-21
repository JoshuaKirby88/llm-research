import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { APIKeyRepo } from "@/src/repos"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { RunTestForm } from "./_components/run-test-form"

const Page = async () => {
	const user = await authProcedure("signedIn")
	const apiKey = await APIKeyRepo.query(user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	if (!APIKeyTable.keyExists(maskedAPIKey)) {
		return <AddAPIKeyAlertCard />
	}

	return (
		<div className="w-full max-w-xl">
			<RunTestForm maskedAPIKey={maskedAPIKey} />
		</div>
	)
}

export default Page
