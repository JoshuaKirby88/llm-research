import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { APIKeyRepo } from "@/src/repos"
import { ResearchT } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables"
import { destructureArray } from "@/utils/destructure-array"
import { eq } from "drizzle-orm"

export class QueryModule {
	static async queryResearch(researchId: ResearchT["id"]) {
		const result = await db.query.Research.findFirst({
			where: eq(Research.id, researchId),
			with: {
				independentVariable: {
					with: { independentValues: true },
				},
				blockingVariables: {
					with: { blockingValues: true },
				},
				dependentValues: true,
				messageTemplates: true,
				evalPrompt: true,
			},
		})

		if (!result) {
			throw new Error("No research")
		}

		const [
			[research],
			{
				independentVariable: [independentVariable],
				evalPrompt: [evalPrompt],
				...rest
			},
		] = destructureArray([result], {
			independentVariable: { independentValues: true },
			blockingVariables: { blockingValues: true },
			dependentValues: true,
			messageTemplates: true,
			evalPrompt: true,
		})

		return { research, independentVariable, evalPrompt, ...rest }
	}

	static async queryAPIKey(userId: string) {
		const apiKey = await APIKeyRepo.query(userId)
		return APIKeyTable.validate(apiKey)
	}
}
