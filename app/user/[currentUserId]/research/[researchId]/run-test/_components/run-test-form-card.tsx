import { Card } from "@/components/ui/card"
import { BlockingValueT, BlockingVariableT, IndependentValueT, RunTestFormS } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { useFormContext } from "react-hook-form"

export const RunTestFormCard = (props: { independentValues: IndependentValueT[]; blockingVariables: BlockingVariableT[]; blockingValues: BlockingValueT[] }) => {
	const form = useFormContext<RunTestFormS>()
	const [models, iterations] = form.watch(["models", "iterations"])

	const blockingVariableCombinations = VariableTable.createCombination({ blockingVariables: props.blockingVariables, blockingValues: props.blockingValues })
	const totalIterations = models.length * props.independentValues.length * blockingVariableCombinations.length * iterations

	return <Card>Total Iterations: {totalIterations}</Card>
}
