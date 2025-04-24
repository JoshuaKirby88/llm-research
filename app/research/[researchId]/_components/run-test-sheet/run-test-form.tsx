"use client"

import { runTestAction } from "@/actions/test/run-test.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Separator } from "@/components/ui/separator"
import { BlockingVariableWithValueT, IndependentValueT, MaskedAPIKeyT, RunTestFormS } from "@/src/schemas"
import { runTestFormSchema } from "@/src/schemas"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { HashIcon, RocketIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { AIModelSelect } from "./ai-model-select"
import { RunTestFormCard } from "./run-test-form-card"

export const RunTestForm = (props: { maskedAPIKey: MaskedAPIKeyT; independentValues: IndependentValueT[]; blockingVariablesWithValues: BlockingVariableWithValueT[] }) => {
	const params = useParams<{ researchId: string }>()

	const form = useForm<RunTestFormS>({
		resolver: zodResolver(runTestFormSchema),
		defaultValues: { models: [], iterations: 1 },
	})

	const onSubmit = async (input: RunTestFormS) => {
		const result = await runTestAction({ ...input, researchId: Number.parseInt(params.researchId) })
		isResultValid(result)
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="flex h-full flex-col justify-between">
			<div className="space-y-10">
				<div className="space-y-2">
					<LabelWithTooltip>Select AI Models to run the tests on</LabelWithTooltip>
					<AIModelSelect maskedAPIKey={props.maskedAPIKey} name="models" />
				</div>

				<div className="space-y-2">
					<LabelWithTooltip icon={<HashIcon />} title="Number of tests to run" description="Run multiple tests per all combination of models, independent variables, and blocking variables.">
						Iterations per combination
					</LabelWithTooltip>
					<FormInput name="iterations" type="number" />
				</div>
			</div>

			<div className="space-y-5">
				<RunTestFormCard independentValues={props.independentValues} blockingVariablesWithValues={props.blockingVariablesWithValues} />

				<Separator />

				<FormButton variant="green">
					<RocketIcon />
					Run Tests
				</FormButton>
			</div>
		</Form>
	)
}
