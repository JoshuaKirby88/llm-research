import { db } from "@/drizzle/db"
import { Research } from "@/drizzle/schema"
import { ResearchRepo } from "@/src/repos"
import { ClerkPublicUser, ClerkService } from "@/src/services/clerk.service"
import { VariableTable } from "@/src/tables"
import { deDupe } from "@/utils/de-dupe"
import { destructureArray } from "@/utils/destructure-array"
import { and, eq } from "drizzle-orm"
import { testFilterToDrizzle } from "../_components/test-filter/test-filter-to-drizzle"

export const testPageQuery = async (input: { params: NextParam<"researchId" | "testBatchId">; searchParams: NextSearchParam; user: ClerkPublicUser }) => {
	const { testBatchFilters, testFilters, testToBlockingValueFilters } = testFilterToDrizzle({ params: input.params, searchParams: input.searchParams })

	// TODO: Use .select over .query for blockingVariableCombination filter
	const result = await db.query.Research.findFirst({
		where: and(eq(Research.id, Number.parseInt(input.params.researchId)), ResearchRepo.getPublicWhere({ userId: input.user.userId })),
		with: {
			contributors: true,
			independentVariable: { with: { independentValues: true } },
			blockingVariables: { with: { blockingValues: true } },
			messagePrompts: true,
			evalPrompt: true,
			dependentValues: true,
			testBatches: {
				where: testBatchFilters,
				with: {
					testModelBatches: {
						with: {
							tests: {
								where: testFilters,
								with: {
									testToBlockingValues: {
										where: testToBlockingValueFilters,
									},
									messages: true,
									evals: true,
								},
							},
						},
					},
				},
			},
		},
	})

	if (!result) {
		return {}
	}

	const [
		[research],
		{
			contributors,
			independentVariable: [independentVariable],
			independentValues,
			blockingVariables,
			blockingValues,
			messagePrompts,
			evalPrompt: [evalPrompt],
			dependentValues,
			testModelBatches,
			tests: _tests,
			testToBlockingValues,
			messages,
			evals,
		},
	] = destructureArray([result], {
		contributors: true,
		independentVariable: { independentValues: true },
		blockingVariables: { blockingValues: true },
		messagePrompts: true,
		evalPrompt: true,
		dependentValues: true,
		testBatches: { testModelBatches: { tests: { testToBlockingValues: true, messages: true, evals: true } } },
	})

	const testToBlockingValueTestIds = testToBlockingValues.map(ttbv => ttbv.testId)
	const tests = _tests.filter(t => testToBlockingValueTestIds.includes(t.id))

	const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables, blockingValues })

	const queriedUsers = await ClerkService.queryUsers(
		contributors.map(c => c.userId),
		{ serialize: true },
	)

	const models = deDupe(testModelBatches, "model").map(tmb => tmb.model)

	// TODO: This is inconsistent with other downloadable files
	const toDownload = {
		...research,
		contributors,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messagePrompts,
		evalPrompt,
		dependentValues,
		testModelBatches,
		tests,
		testToBlockingValues,
		messages,
		evals,
		blockingVariableCombinations,
	}

	return {
		research,
		contributors,
		independentVariable,
		independentValues,
		blockingVariables,
		blockingValues,
		messagePrompts,
		evalPrompt,
		dependentValues,
		testModelBatches,
		tests,
		testToBlockingValues,
		messages,
		evals,
		blockingVariableCombinations,
		queriedUsers,
		models,
		toDownload,
	}
}
