import { ClerkAvatar } from "@/components/clerk/clerk-avatar"
import { createColumnConfigHelper } from "@/components/data-table-filter/core/filters"
import { FilterModelUnion } from "@/components/data-table-filter/core/types"
import { BlockingValueT, ContributorT, DependentValueT, IndependentValueT, IndependentVariableT, TestBatchT, TestT, TestToBlockingValueT } from "@/src/schemas"
import { ClerkQueriedUser } from "@/src/services/clerk.service"
import { CalendarIcon, GiftIcon, SquareIcon, SquareStackIcon, VariableIcon } from "lucide-react"

export type TestFilterRow = {
	contributor: ContributorT
	testBatch: TestBatchT
	testToBlockingValues: TestToBlockingValueT[]
	test: TestT
}
export type TestFilterColumnsConfigProps = {
	queriedUsers: ClerkQueriedUser[]
	contributors: ContributorT[]
	independentVariable: IndependentVariableT
	independentValues: IndependentValueT[]
	blockingValues: BlockingValueT[]
	dependentValues: DependentValueT[]
}
export type TestFilter = Omit<FilterModelUnion, "columndId"> & { type: Return<typeof testFilterColumnsConfig>[number]["type"]; columnId: Return<typeof testFilterColumnsConfig>[number]["id"] }

const row = createColumnConfigHelper<TestFilterRow>()

export const testFilterColumnsConfig = (props: TestFilterColumnsConfigProps) =>
	[
		row
			.number()
			.id("testBatchId")
			.accessor(row => row.testBatch.id)
			.displayName("Test Batch ID")
			.icon(SquareStackIcon)
			.build(),
		row
			.date()
			.id("testBatchCreatedAt")
			.accessor(row => row.testBatch.createdAt)
			.displayName("Date")
			.icon(CalendarIcon)
			.build(),
		row
			.option()
			.id("contributorIds")
			.accessor(row => row.contributor.id)
			.displayName("Contributor")
			.icon(GiftIcon)
			.options(
				props.contributors.map(contributor => {
					const queriedUser = props.queriedUsers.find(user => user.id === contributor.userId)
					return {
						value: contributor.id,
						label: "",
						icon: <ClerkAvatar disabled size="xxxs" userId={contributor.userId} user={queriedUser} />,
					}
				}),
			)
			.build(),
		row
			.option()
			.id("independentValueId")
			.accessor(row => row.test.independentValueId)
			.displayName("Independent Variable")
			.icon(VariableIcon)
			.options(
				props.independentValues.map(iVal => ({
					value: iVal.id,
					label: iVal.value,
				})),
			)
			.build(),
		row
			.multiOption()
			.id("blockingValueId")
			.accessor(row => row.testToBlockingValues.map(ttbv => ttbv.blockingValueId))
			.displayName("Blocking Variables")
			.icon(VariableIcon)
			.options(
				props.blockingValues.map(bVal => ({
					value: bVal.id,
					label: bVal.value,
				})),
			)
			.build(),
		row
			.option()
			.id("dependentValueId")
			.accessor(row => row.test.dependentValueId)
			.displayName("Dependent Variable")
			.icon(VariableIcon)
			.options(
				props.dependentValues.map(dVal => ({
					value: dVal.id,
					label: dVal.value,
					icon: <circle className="size-2.5 rounded-full" style={{ backgroundColor: dVal.color }} />,
				})),
			)
			.build(),
		row
			.number()
			.id("testId")
			.accessor(row => row.test.id)
			.displayName("Test ID")
			.icon(SquareIcon)
			.build(),
	] as const
