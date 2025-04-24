import { MultiSelect, Option } from "@/components/ui/multi-select"
import { AIFeature } from "@/src/features"
import { MaskedAPIKeyT } from "@/src/schemas"
import { Controller, useFormContext } from "react-hook-form"

export const AIModelSelect = (props: { name: string; maskedAPIKey: MaskedAPIKeyT }) => {
	const { control } = useFormContext()
	const providers = AIFeature.providersByMaskedAPIKey(props.maskedAPIKey)

	const options: Option[] = providers.flatMap(provider =>
		AIFeature.providerMap[provider].models.map(model => ({
			provider: AIFeature.providerMap[provider].title,
			value: model,
			label: model,
		})),
	)

	return (
		<Controller
			control={control}
			name={props.name}
			render={({ field: { value, onChange } }) => {
				const selectedValues = Array.isArray(value) ? options.filter(option => value.includes(option.value)) : []

				return (
					<MultiSelect
						options={options}
						groupBy="provider"
						value={selectedValues}
						onChange={selectedOptions => {
							onChange(selectedOptions.map(option => option.value))
						}}
					/>
				)
			}}
		/>
	)
}
