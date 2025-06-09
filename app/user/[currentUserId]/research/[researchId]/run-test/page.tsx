import { AddAPIKeyAlertCard } from "@/components/add-api-key-alert-card"
import { Suspense } from "@/components/suspense"
import { APIKeyTable } from "@/src/tables"
import { authProcedure } from "@/utils/auth-procedure"
import { notFound } from "next/navigation"
import { RunTestForm } from "./_components/run-test-form"
import { runTestPageQuery } from "./_queries/run-test-page-query"

const Page = Suspense(async (props: { params: Promise<NextParam<"researchId">> }) => {
	const params = await props.params
	const user = await authProcedure("signedIn")

	const { research, independentVariable, independentValues, blockingVariables, blockingValues, maskedAPIKey } = await runTestPageQuery({ params, user })

	if (!research) {
		notFound()
	}

	return (
		<div className="flex w-full max-w-xl grow flex-col space-y-20">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-4xl">Run Test</h1>
				<p className="font-medium text-lg text-muted-foreground">{research.name}</p>
			</div>

			{APIKeyTable.keyExists(maskedAPIKey) ? (
				<RunTestForm maskedAPIKey={maskedAPIKey} independentValues={independentValues} blockingVariables={blockingVariables} blockingValues={blockingValues} />
			) : (
				<AddAPIKeyAlertCard />
			)}
		</div>
	)
})

export default Page
