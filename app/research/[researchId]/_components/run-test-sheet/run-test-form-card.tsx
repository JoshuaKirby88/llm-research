import { Card } from "@/components/ui/card"
import { BlockingVariableWithValueT, IndependentValueT, RunTestForm } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { useFormContext } from "react-hook-form"

export const RunTestFormCard = (props: { independentValues: IndependentValueT[]; blockingVariablesWithValues: BlockingVariableWithValueT[] }) => {
	const form = useFormContext<RunTestForm>()
	const [models, iterations] = form.watch(["models", "iterations"])

	const blockingVariableCombinations = VariableTable.createCombination(props.blockingVariablesWithValues)
	const totalIterations = models.length * props.independentValues.length * blockingVariableCombinations.length * iterations

	return <Card>Total Iterations: {totalIterations}</Card>
}
