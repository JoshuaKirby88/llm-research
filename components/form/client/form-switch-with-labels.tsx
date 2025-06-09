"use client"

import { SwitchWithLabels } from "@/components/ui/switch-with-labels"
import { ComponentProps } from "react"
import { Controller, useFormContext } from "react-hook-form"

export const FormSwitchWithLabels = (props: ComponentProps<typeof SwitchWithLabels> & { name: string }) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={props.name}
			control={control}
			render={({ field }) => {
				return <SwitchWithLabels {...props} checked={field.value} onCheckedChange={field.onChange} />
			}}
		/>
	)
}
