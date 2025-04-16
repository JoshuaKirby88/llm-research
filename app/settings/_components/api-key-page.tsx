"use client"

import { saveAPIKeyAction } from "@/actions/settings/save-api-key.action"
import { Form } from "@/components/form/form"
import { FormButton } from "@/components/form/form-button"
import { FormInput } from "@/components/form/form-input"
import { Label } from "@/components/ui/label"
import { MaskedAPIKeyT, apiKeySchema } from "@/src/schemas"
import { APIKeyKey, APIKeyTable } from "@/src/tables/api-key.table"
import { isActionValid } from "@/utils/actions/is-action-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const config = {
	apiKeys: [
		{ key: "openai", title: "OpenAI" },
		{ key: "google", title: "Google" },
		{ key: "anthropic", title: "Anthropic" },
	] satisfies { key: APIKeyKey; [key: string]: any }[],
}

export const APIKeyPage = (props: { maskedAPIKey: MaskedAPIKeyT | null }) => {
	const defaultAPIKeyRef = useRef(props.maskedAPIKey)

	const schema = apiKeySchema.pick({ openai: true, google: true, anthropic: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: Object.fromEntries(APIKeyTable.keys.map(key => [key, props.maskedAPIKey?.[key] ?? ""])),
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		const filteredAPIKey = APIKeyTable.filter(defaultAPIKeyRef.current, input)

		if (!Object.keys(filteredAPIKey).length) {
			return form.reset()
		}

		const result = await saveAPIKeyAction(filteredAPIKey)

		if (isActionValid(result)) {
			form.reset(result.maskedUpdatedAPIKey)
			defaultAPIKeyRef.current = result.maskedUpdatedAPIKey
		}
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="space-y-5">
			{config.apiKeys.map(apiKey => (
				<div key={apiKey.key}>
					<Label className="mb-2">{apiKey.title}</Label>
					<div className="flex items-center gap-2">
						<FormInput name={apiKey.key} />
					</div>
				</div>
			))}

			<FormButton>Save API Keys</FormButton>
		</Form>
	)
}
