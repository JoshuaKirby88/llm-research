"use client"

import { saveAPIKeyAction } from "@/actions/settings/save-api-key.action"
import { Form } from "@/components/form/form"
import { FormButton } from "@/components/form/form-button"
import { FormInput } from "@/components/form/form-input"
import { Label } from "@/components/ui/label"
import { MaskedAPIKeyT, apiKeySchema } from "@/src/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const config = {
	apiKeys: [
		{ key: "openai", title: "OpenAI" },
		{ key: "google", title: "Google" },
		{ key: "anthropic", title: "Anthropic" },
	],
}

export const APIKeyPage = (props: { maskedAPIKey: MaskedAPIKeyT | null }) => {
	const schema = apiKeySchema.pick({ openai: true, google: true, anthropic: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: props.maskedAPIKey ?? {},
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		const result = await saveAPIKeyAction(input)

		console.log("result", JSON.stringify(result, null, 2))
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="space-y-5">
			{config.apiKeys.map(apiKey => (
				<div key={apiKey.key}>
					<Label className="mb-2">{apiKey.title}</Label>
					<FormInput name={apiKey.key} />
				</div>
			))}

			<FormButton>Save API Keys</FormButton>
		</Form>
	)
}
