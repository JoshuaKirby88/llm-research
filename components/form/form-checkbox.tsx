import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/cn"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"

export const FormCheckbox = ({ name, label, className, ...props }: React.ComponentProps<typeof Checkbox> & { name: string; label: string }) => {
	const { control } = useFormContext()

	return (
		<div className={cn("flex w-fit items-center", className)}>
			<Controller name={name} control={control} render={({ field }) => <Checkbox {...props} id={name} checked={field.value} onCheckedChange={field.onChange} />} />

			<Label htmlFor={name} className="cursor-pointer">
				{label}
			</Label>
		</div>
	)
}
