import { RunTestForm } from "@/app/test/[researchId]/_components/run-test-form"
import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { APIKeyRepo } from "@/src/repos"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"

export const RunTestSheet = async (props: { children: React.ReactNode }) => {
	const user = await authProcedure("signedIn")
	const apiKey = await APIKeyRepo.query(user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	if (!APIKeyTable.keyExists(maskedAPIKey)) {
		return <AddAPIKeyAlertCard />
	}

	return (
		<Sheet>
			<SheetTrigger asChild>{props.children}</SheetTrigger>

			<SheetContent>
				<RunTestForm maskedAPIKey={maskedAPIKey} />
			</SheetContent>
		</Sheet>
	)
}
