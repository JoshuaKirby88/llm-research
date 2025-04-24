"use client"

import { runTestAction } from "@/actions/test/run-test.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { BlockingVariableWithValueT, IndependentValueT, MaskedAPIKeyT } from "@/src/schemas"
import { runTestFormSchema } from "@/src/schemas"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { HashIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AIModelSelect } from "./ai-model-select"
import { RunTestFormCard } from "./run-test-form-card"

export const RunTestForm = (props: { maskedAPIKey: MaskedAPIKeyT; independentValues: IndependentValueT[]; blockingVariablesWithValues: BlockingVariableWithValueT[] }) => {
	const params = useParams<{ researchId: string }>()

	const form = useForm<z.infer<typeof runTestFormSchema>>({
		resolver: zodResolver(runTestFormSchema),
		defaultValues: { models: [], iterations: 1 },
	})

	const onSubmit = async (input: z.infer<typeof runTestFormSchema>) => {
		const result = await runTestAction({ ...input, researchId: Number.parseInt(params.researchId) })
		isResultValid(result)
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<RunTestFormCard independentValues={props.independentValues} blockingVariablesWithValues={props.blockingVariablesWithValues} />

			<LabelWithTooltip>Select AI Models to run the tests on</LabelWithTooltip>
			<AIModelSelect maskedAPIKey={props.maskedAPIKey} name="models" />

			<LabelWithTooltip icon={<HashIcon />} title="Number of tests to run" description="Run multiple tests per all combination of models, independent variables, and blocking variables.">
				Iterations per combination
			</LabelWithTooltip>
			<FormInput name="iterations" type="number" />

			<FormButton>Run Tests</FormButton>
		</Form>
	)
}
