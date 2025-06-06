"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComponentProps } from "react"
import { Controller, useFormContext } from "react-hook-form"

export const FormSelect = (props: { name: string; placeholder?: string; required?: boolean; children: React.ReactNode }) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={props.name}
			control={control}
			render={({ field }) => {
				return (
					<Select onValueChange={field.onChange} value={field.value}>
						<SelectTrigger id={props.name} className="capitalize [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
							<SelectValue placeholder={props.placeholder} />
						</SelectTrigger>

						<SelectContent className="z-[999] [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
							{props.children}
						</SelectContent>
					</Select>
				)
			}}
		/>
	)
}

export const FormSelectGroup = (props: { name: string; children: React.ReactNode }) => {
	return (
		<SelectGroup>
			<SelectLabel className="ps-2">{props.name}</SelectLabel>
			{props.children}
		</SelectGroup>
	)
}

export const FormSelectItem = ({ value, children, ...props }: { value: string } & ComponentProps<typeof SelectItem>) => {
	return (
		<SelectItem value={value} {...props}>
			{children}
		</SelectItem>
	)
}
