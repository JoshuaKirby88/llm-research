import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { APIKeyRepo } from "@/src/repos"
import { BlockingVariableWithValueT, IndependentValueT } from "@/src/schemas"
import { ClerkUser } from "@/src/services/clerk.service"
import { APIKeyTable } from "@/src/tables"
import { RunTestForm } from "./run-test-form"

export const RunTestSheet = async (props: { user: ClerkUser; independentValues: IndependentValueT[]; blockingVariablesWithValues: BlockingVariableWithValueT[]; children: React.ReactNode }) => {
	const apiKey = await APIKeyRepo.query(props.user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return (
		<Sheet>
			<SheetTrigger asChild>{props.children}</SheetTrigger>

			<SheetContent>
				{maskedAPIKey ? (
					<RunTestForm maskedAPIKey={maskedAPIKey} independentValues={props.independentValues} blockingVariablesWithValues={props.blockingVariablesWithValues} />
				) : (
					<AddAPIKeyAlertCard />
				)}
			</SheetContent>
		</Sheet>
	)
}
