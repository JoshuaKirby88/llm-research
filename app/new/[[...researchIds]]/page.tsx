import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { CreateResearchI } from "@/src/schemas"
import { authProcedure } from "@/utils/auth-procedure"
import { pick } from "@/utils/pick"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { CreateResearchForm } from "./_components/create-research-form"

const Page = Suspense(async (props: { params: Promise<NextParam<"researchIds">> }) => {
	const params = await props.params
	const user = await authProcedure("signedIn")

	const defaultValues: CreateResearchI = await (async () => {
		if (Array.isArray(params.researchIds)) {
			const research = await db.query.Research.findFirst({
				where: and(eq(Research.id, Number.parseInt(params.researchIds[0])), ResearchRepo.getPublicWhere({ user })),
				with: {
					independentVariable: { with: { independentValues: true } },
					blockingVariables: { with: { blockingValues: true } },
					dependentValues: true,
					messageTemplates: true,
					evalPrompt: true,
				},
			})

			if (!research || !research.independentVariable || !research.evalPrompt) {
				notFound()
			}

			return {
				research: { name: research.name },
				independentVariable: { name: research.independentVariable.name, values: research.independentVariable.independentValues.map(iVal => iVal.value) },
				blockingVariables: research.blockingVariables.map(bVar => ({ name: bVar.name, values: bVar.blockingValues.map(bVal => bVal.value) })),
				messageTemplates: research.messageTemplates.map(mp => pick(mp, ["role", "text", "isPrompt"])),
				evalPrompt: { text: research.evalPrompt.text },
				dependentValues: research.dependentValues.map(dVal => dVal.value),
			} satisfies CreateResearchI
		} else {
			return {
				research: { name: "" },
				independentVariable: { name: "", values: [] },
				blockingVariables: [{ name: "", values: [] }],
				messageTemplates: [{ role: "system", text: "", isPrompt: false }],
				evalPrompt: { text: "" },
				dependentValues: [],
			} satisfies CreateResearchI
		}
	})()

	return (
		<div className="mb-20 w-full max-w-3xl">
			<CreateResearchForm defaultValues={defaultValues} />
		</div>
	)
})

export default Page
