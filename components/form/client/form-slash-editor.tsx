"use client"

import { SlashEditor } from "@/components/slash-editor"
import { Controller, useFormContext } from "react-hook-form"

export function FormSlashEditor(props: { name: string } & React.ComponentProps<typeof SlashEditor>) {
	const { control } = useFormContext()

	return <Controller control={control} name={props.name} render={({ field }) => <SlashEditor value={field.value} onChange={field.onChange} {...props} />} />
}
