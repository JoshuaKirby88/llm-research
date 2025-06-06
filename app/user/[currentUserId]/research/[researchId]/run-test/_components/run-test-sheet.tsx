import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { APIKeyRepo } from "@/src/repos"
import { BlockingValueT, BlockingVariableT, IndependentValueT, ResearchT } from "@/src/schemas"
import { ClerkPublicUser } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables"
import { RunTestForm } from "./run-test-form"

type Props = {
	user: ClerkPublicUser
	research: ResearchT
	independentValues: IndependentValueT[]
	blockingVariables: BlockingVariableT[]
	blockingValues: BlockingValueT[]
	children: React.ReactNode
}

export const RunTestSheet = async (props: Props) => {
	if (props.user.userId) {
		const apiKey = await APIKeyRepo.query(props.user.userId)
		const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

		return (
			<Sheet>
				<SheetTrigger asChild>{props.children}</SheetTrigger>

				<SheetContent>
					<SheetHeader>
						<SheetTitle>Run tests</SheetTitle>
						<SheetDescription>{props.research.name}</SheetDescription>
					</SheetHeader>

					<div className="h-full px-3 py-5">
						{APIKeyTable.keyExists(maskedAPIKey) ? (
							<RunTestForm maskedAPIKey={maskedAPIKey} independentValues={props.independentValues} blockingVariables={props.blockingVariables} blockingValues={props.blockingValues} />
						) : (
							<AddAPIKeyAlertCard />
						)}
					</div>
				</SheetContent>
			</Sheet>
		)
	} else {
		return props.children
	}
}
