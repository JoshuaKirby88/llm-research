"use client"

import { Form } from "@/components/form/form"
import { FormButton } from "@/components/form/form-button"
import { FormInput } from "@/components/form/form-input"
import { FormTagInput } from "@/components/form/form-tag-input"
import { FormTextarea } from "@/components/form/form-textarea"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const CreateResearchForm = () => {
	const schema = z.object({ researchName: z.string(), independentVariableName: z.string(), independentVariables: z.string().array() })
	const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

	const onSubmit = async (input: z.infer<typeof schema>) => {
		console.log("input", input)
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="">
			<Label className="text-3xl">Research Question</Label>
			<FormInput name="researchName" />

			<h3 className="mt-10 text-2xl">Independent variable</h3>
			<Label>Name</Label>
			<FormInput name="independentVariableName" />
			<Label>Variables</Label>
			<FormTagInput name="independentVariables" />

			<h3 className="mt-10 text-2xl">Blocking variable</h3>
			<Label>Name</Label>
			<FormInput name="blockingVariableName" />
			<Label>Variables</Label>
			<FormTagInput name="blockingVariables" />

			<h3 className="mt-10 text-2xl">Messages prompt</h3>
			<Label>System</Label>
			<FormTextarea name="system" />
			<Label>User</Label>
			<FormTextarea name="user" />

			<Label className="mt-10 text-2xl">Evaluation prompt</Label>
			<FormTextarea name="evalPrompt" />

			<Label className="mt-10 text-2xl">Result enums</Label>
			<FormTagInput name="resultEnums" />

			<FormButton className="mt-10">Submit</FormButton>
		</Form>
	)
}
