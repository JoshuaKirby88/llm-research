"use client"

import { saveAPIKeyAction } from "@/actions/settings/save-api-key.action"
import { Form } from "@/components/form/client/form"
import { FormButton } from "@/components/form/client/form-button"
import { FormInput } from "@/components/form/client/form-input"
import { AIIcons } from "@/components/icons/ai-icons"
import { Label } from "@/components/ui/label"
import { AIFeature } from "@/src/features"
import { MaskedAPIKeyT, apiKeySchema } from "@/src/schemas"
import { APIKeyTable } from "@/src/tables"
import { isResultValid } from "@/utils/actions/is-result-valid"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const APIKeyPage = (props: { maskedAPIKey: MaskedAPIKeyT | null }) => {
	const defaultAPIKeyRef = useRef(props.maskedAPIKey)

	const schema = apiKeySchema.pick({ openai: true, google: true, anthropic: true })
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: Object.fromEntries(AIFeature.providers.map(aiProvider => [aiProvider, props.maskedAPIKey?.[aiProvider] ?? ""])),
	})

	const onSubmit = async (input: z.infer<typeof schema>) => {
		const filteredAPIKey = APIKeyTable.filter(defaultAPIKeyRef.current, input)

		if (!Object.keys(filteredAPIKey).length) {
			return form.reset()
		}

		const result = await saveAPIKeyAction(filteredAPIKey)

		if (isResultValid(result)) {
			form.reset(result.maskedUpdatedAPIKey)
			defaultAPIKeyRef.current = result.maskedUpdatedAPIKey
		}
	}

	return (
		<Form {...form} onSubmit={onSubmit} className="space-y-5">
			{AIFeature.providers.map(provider => (
				<div key={provider}>
					<Label className="mb-2">
						<AIIcons aiProvider={provider} />
						{AIFeature.providerMap[provider].title}
					</Label>
					<div className="flex items-center gap-2">
						<FormInput name={provider} />
					</div>
				</div>
			))}

			<FormButton>Save API Keys</FormButton>
		</Form>
	)
}
