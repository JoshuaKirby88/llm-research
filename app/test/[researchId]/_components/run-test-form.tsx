"use client"

import { runTestAction } from "@/actions/test/run-test.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { MaskedAPIKeyT } from "@/src/schemas"
import { runTestSchema } from "@/src/schemas/features/run-test.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { HashIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AIModelSelect } from "./ai-model-select"

export const RunTestForm = (props: { maskedAPIKey: MaskedAPIKeyT }) => {
	const params = useParams<{ researchId: string }>()
	const schema = runTestSchema.pick({ models: true, iterations: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { models: [] },
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		console.log("input", JSON.stringify(input, null, 2))

		const result = await runTestAction({ ...input, researchId: Number.parseInt(params.researchId) })
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<LabelWithTooltip>Select AI Models to run the tests on</LabelWithTooltip>
			<AIModelSelect maskedAPIKey={props.maskedAPIKey} name="models" />
			{form.formState.errors.models?.message}

			<LabelWithTooltip icon={<HashIcon />} title="Number of tests to run" description="Run multiple tests per all combination of models, independent variables, and blocking variables.">
				Iterations per combination
			</LabelWithTooltip>
			<FormInput name="iterations" type="number" />

			<FormButton>Run Tests</FormButton>
		</Form>
	)
}
