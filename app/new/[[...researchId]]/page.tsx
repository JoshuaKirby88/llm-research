import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { CreateResearchI } from "@/src/schemas"
import { authProcedure } from "@/utils/auth-procedure"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { CreateResearchForm } from "./_components/create-research-form"

const Page = async (props: { params: Promise<{ researchId: string | string[] | undefined }> }) => {
	const params = await props.params
	const user = await authProcedure("signedIn")

	const defaultValues: Partial<CreateResearchI> = await (async () => {
		if (typeof params.researchId === "string") {
			const research = await db.query.Research.findFirst({
				where: and(eq(Research.id, Number.parseInt(params.researchId)), ResearchRepo.getPublicWhere({ userId: user.userId })),
				with: {
					independentVariable: { with: { independentValues: true } },
					blockingVariables: { with: { blockingValues: true } },
					dependentValues: true,
					messagePrompts: true,
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
				systemMessagePrompt: { text: research.messagePrompts.find(mp => mp.role === "system")!.text },
				userMessagePrompt: { text: research.messagePrompts.find(mp => mp.role === "user")!.text },
				evalPrompt: { text: research.evalPrompt.text },
				dependentValues: research.dependentValues.map(dVal => dVal.value),
			} satisfies CreateResearchI
		} else {
			return { blockingVariables: [{ name: "", values: [] }] }
		}
	})()

	return (
		<div className="w-full max-w-3xl">
			<CreateResearchForm defaultValues={defaultValues} />
		</div>
	)
}

export default Page
