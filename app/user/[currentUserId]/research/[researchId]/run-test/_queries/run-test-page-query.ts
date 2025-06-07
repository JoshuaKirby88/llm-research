import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { APIKeyRepo } from "@/src/repos"
import { ClerkSignedInUser } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables"
import { destructureArray } from "@/utils/destructure-array"
import { eq } from "drizzle-orm"

type Input = {
	params: NextParam<"researchId">
	user: ClerkSignedInUser
}

export const runTestPageQuery = async (input: Input) => {
	const [maskedAPIKey, researchResult] = await Promise.all([queryMaskedAPIKey(input), queryResearch(input)])

	return {
		maskedAPIKey,
		...researchResult,
	}
}

const queryMaskedAPIKey = async (input: Input) => {
	const apiKey = await APIKeyRepo.query(input.user.userId)
	const maskedAPIKey = apiKey ? APIKeyTable.mask(APIKeyTable.decrypt(apiKey)) : null

	return maskedAPIKey
}

const queryResearch = async (input: Input) => {
	const result = await db.query.Research.findFirst({
		where: eq(Research.id, Number.parseInt(input.params.researchId)),
		with: {
			independentVariable: {
				with: {
					independentValues: true,
				},
			},
			blockingVariables: {
				with: {
					blockingValues: true,
				},
			},
		},
	})

	if (!result) {
		return {}
	}

	const [[research], { independentVariable, independentValues, blockingVariables, blockingValues }] = destructureArray([result], {
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
	})

	return {
		research,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
	}
}
