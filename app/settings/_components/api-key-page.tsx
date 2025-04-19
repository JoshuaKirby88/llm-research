"use client"

import { saveAPIKeyAction } from "@/actions/settings/save-api-key.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { AIIcons } from "@/components/icons/ai-icons"
import { Label } from "@/components/ui/label"
import { AIProvider, MaskedAPIKeyT, aiProviders, apiKeySchema } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables/api-key.table"
import { isActionValid } from "@/utils/actions/is-action-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const config = {
	apiKeys: [
		{ aiProvider: "openai", title: "OpenAI" },
		{ aiProvider: "google", title: "Google" },
		{ aiProvider: "anthropic", title: "Anthropic" },
	] satisfies { aiProvider: AIProvider; [key: string]: any }[],
}

export const APIKeyPage = (props: { maskedAPIKey: MaskedAPIKeyT | null }) => {
	const defaultAPIKeyRef = useRef(props.maskedAPIKey)

	const schema = apiKeySchema.pick({ openai: true, google: true, anthropic: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: Object.fromEntries(aiProviders.map(aiProvider => [aiProvider, props.maskedAPIKey?.[aiProvider] ?? ""])),
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
				<div key={apiKey.aiProvider}>
					<Label className="mb-2">
						<AIIcons aiProvider={apiKey.aiProvider} />
						{apiKey.title}
					</Label>
					<div className="flex items-center gap-2">
						<FormInput name={apiKey.aiProvider} />
					</div>
				</div>
			))}

			<FormButton>Save API Keys</FormButton>
		</Form>
	)
}
