import { RunTestForm } from "@/app/test/[researchId]/_components/run-test-form"
import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { APIKeyRepo } from "@/src/repos"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { RocketIcon } from "lucide-react"

export const RunTestSheet = async () => {
	const user = await authProcedure("signedIn")
	const apiKey = await APIKeyRepo.query(user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	if (!APIKeyTable.keyExists(maskedAPIKey)) {
		return <AddAPIKeyAlertCard />
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="green">
					<RocketIcon />
					Run Tests
				</Button>
			</SheetTrigger>

			<SheetContent>
				<RunTestForm maskedAPIKey={maskedAPIKey} />
			</SheetContent>
		</Sheet>
	)
}
