"use client"

import { runTestAction } from "@/actions/test/run-test.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { LabelWithTooltip } from "@/components/form/label-with-tooltip"
import { Input } from "@/components/ui/input"
import { MaskedAPIKeyT } from "@/src/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { HashIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AIModelSelect } from "./ai-model-select"
import { runTestSchema } from "@/src/schemas/features/run-test.schema"

export const RunTestForm = (props: { maskedAPIKey: MaskedAPIKeyT }) => {
	const params = useParams<{ researchId: string }>()
	const schema = runTestSchema.pick({ models: true, iterations: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { models: [] },
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		const result = await runTestAction({ ...input, researchId: Number.parseInt(params.researchId) })
	}

	return (
		<Form {...form} onSubmit={onSubmit}>
			<div>
				<LabelWithTooltip>Select AI Models to run the tests on</LabelWithTooltip>
				<AIModelSelect maskedAPIKey={props.maskedAPIKey} name="models" />
			</div>

			<div>
				<LabelWithTooltip icon={<HashIcon />} title="Number of tests to run" description="Run multiple tests per all combination of models, independent variables, and blocking variables.">
					Iterations per combination
				</LabelWithTooltip>
				<Input name="iterations" type="number" />
			</div>

			<FormButton>Run Tests</FormButton>
		</Form>
	)
}
