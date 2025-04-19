"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ComponentProps } from "react"
import { Controller, useFormContext } from "react-hook-form"

export const FormSelect = (props: { label: string; name: string; placeholder?: string; required?: boolean; children: React.ReactNode }) => {
	const { control } = useFormContext()

	return (
		<div className="space-y-2">
			<Label>{props.label}</Label>

			<Controller
				name={props.name}
				control={control}
				render={({ field }) => {
					return (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger id={props.name} className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
								<SelectValue placeholder={props.placeholder} />
							</SelectTrigger>

							<SelectContent className="z-[999] [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
								{props.children}
							</SelectContent>
						</Select>
					)
				}}
			/>
		</div>
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

export const FormSelectItem = ({ value, image, label, ...props }: { value: string; label: string; image?: string } & ComponentProps<typeof SelectItem>) => {
	return (
		<SelectItem value={value} {...props}>
			{image && <Image src={image} alt={label} width={20} height={20} />}
			<span className="truncate">{label}</span>
		</SelectItem>
	)
}
