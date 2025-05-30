import { TagInput } from "@/components/tag-input"
import { ComponentProps } from "react"
import { Controller, useFormContext } from "react-hook-form"

type Props = { name: string } & Omit<ComponentProps<typeof TagInput>, "tags" | "onTagAdd" | "onTagRemove">

export const FormTagInput = (props: Props) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={props.name}
			render={({ field }) => (
				<TagInput
					tags={field.value || []}
					onTagAdd={tag => {
						const updatedTags = [...(field.value || []), tag]
						field.onChange(updatedTags)
					}}
					onTagRemove={tag => {
						const updatedTags = ((field.value as string[]) || []).filter(t => t !== tag)
						field.onChange(updatedTags)
					}}
					onClearAll={() => field.onChange([])}
					{...props}
				/>
			)}
		/>
	)
}
